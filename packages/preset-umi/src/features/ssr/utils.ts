import { logger } from '@umijs/utils';
import { join } from 'path';
import { IApi } from '../../types';

/** esbuild plugin for resolving umi imports */
export function esbuildUmiPlugin(api: IApi) {
  return {
    name: 'umi',
    setup(build: any) {
      build.onResolve(
        { filter: /^(umi|@umijs\/max|@alipay\/bigfish)$/ },
        () => ({
          path: join(api.paths.absTmpPath, 'exports.ts'),
        }),
      );
    },
  };
}

export function absServerBuildPath(api: IApi) {
  if (api.env === 'development') {
    return join(api.paths.absTmpPath, 'server/umi.server.js');
  }
  return join(
    api.paths.cwd,
    api.userConfig.ssr.serverBuildPath || 'server/umi.server.js',
  );
}

/**
 * get pre-rendered html by route path
 */
export async function getPreRenderedHTML(
  api: IApi,
  htmlTpl: string,
  path: string,
) {
  let markupRender;
  markupRender ??= require(absServerBuildPath(api))._markupGenerator;
  try {
    const markup = await markupRender(path);

    const [mainTpl, extraTpl = ''] = markup.split('</html>');
    // TODO: improve return type for markup generator
    const helmetContent =
      mainTpl.match(/<head>[^]*?(<[^>]+data-rh[^]+)<\/head>/)?.[1] || '';
    const bodyContent = mainTpl.match(/<body[^>]*>([^]+?)<\/body>/)?.[1];

    htmlTpl = htmlTpl
      // append helmet content
      .replace('</head>', `${helmetContent || ''}</head>`)
      // replace #root with pre-rendered body content
      .replace(
        new RegExp(`<div id="${api.config.mountElementId}"[^>]*>.*?</div>`),
        bodyContent,
      )
      // append hidden templates
      .replace(/$/, `${extraTpl}`);
    logger.info(`Pre-render for ${path}`);
  } catch (err) {
    logger.error(`Pre-render ${path} error: ${err}`);
  }

  return htmlTpl;
}
