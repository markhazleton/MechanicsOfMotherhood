import React from 'react';
import { renderToString } from 'react-dom/server';
import AppSSR from './AppSSR';

export interface RenderResult {
  html: string;
  helmet: { title: string; meta: string; link: string };
}

export async function render(url: string): Promise<RenderResult> {
  const helmetContext: any = {};
  const element = React.createElement(AppSSR, { ssrPath: url, helmetContext });
  const html = renderToString(element);
  const helmetRaw = helmetContext.helmet || { title: { toString: () => '' }, meta: { toString: () => '' }, link: { toString: () => '' } };
  const helmet = {
    title: helmetRaw.title.toString(),
    meta: helmetRaw.meta.toString(),
    link: helmetRaw.link.toString()
  };
  return { html, helmet };
}
