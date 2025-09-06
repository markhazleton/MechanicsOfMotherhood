import React from 'react';
import { renderToString } from 'react-dom/server';
import AppSSR from './AppSSR';
import { dehydrate } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

export interface RenderResult {
  html: string;
  dehydratedState: any;
  helmet: { title: string; meta: string; link: string };
}

export async function render(url: string): Promise<RenderResult> {
  const helmetContext: any = {};
  const element = React.createElement(AppSSR, { ssrPath: url, helmetContext });
  const html = renderToString(element);
  const dehydratedState = dehydrate(queryClient);
  const helmetRaw = helmetContext.helmet || { title: { toString: () => '' }, meta: { toString: () => '' }, link: { toString: () => '' } };
  const helmet = {
    title: helmetRaw.title.toString(),
    meta: helmetRaw.meta.toString(),
    link: helmetRaw.link.toString()
  };
  return { html, dehydratedState, helmet };
}
