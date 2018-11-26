// Iterate through the sizes and create a media template
import { sizes } from "./sizes";
import { css } from "styled-components";

export default Object.keys(sizes).reduce((acc, label) => {
    acc[label] = (...args) => css`
    @media (min-width: ${sizes[label] / sizes.base}em) {
      ${css(...args)}
    }
  `;
    return acc
}, {});

export const Print = (...args) => css`
  @media print {
      ${css(...args)}
    }
`;