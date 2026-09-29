import type { MDXComponents } from "mdx/types";
import { Box, Grid, KeyPoint, Quote, Section, SimpleTable, Study, Warn } from "@/components/summary/blocks";

const components = {
  Section,
  KeyPoint,
  Warn,
  Quote,
  Study,
  Grid,
  Box,
  SimpleTable,
  table: ({ children }) => <SimpleTable>{children}</SimpleTable>,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
