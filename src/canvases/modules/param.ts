export type ParamNum = {
  val: number,
  min: number,
  max: number,
  isInt: boolean,
}
export const isParamNum = (arg: any): arg is ParamNum => {
  return (typeof arg.val === 'number')
    && (typeof arg.min === 'number') && (typeof arg.max === 'number')
    && (typeof arg.isInt === 'boolean');
}

export type Color = {
  r: number,
  g: number,
  b: number
}

export const eqColor = (color1: Color, color2: Color): boolean => {
  return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
}

export const isColor = (arg: any): arg is Color => {
  return (typeof arg.r === 'number') && (typeof arg.g === 'number')
    && (typeof arg.b === 'number');
}
export const hexToColor = (code: string): Color => {
  code = code.replace('#', '');
  code = code.toUpperCase();
  const c: Color = {
    r: parseInt(code[0]+code[1], 16),
    g: parseInt(code[2]+code[3], 16),
    b: parseInt(code[4]+code[5], 16)
  }
  return c;
}
const colorElmToHex = (colorElm: number): string => {
  return ("0" + colorElm.toString(16)).slice(-2);
}
export const colorToHex = (color: Color): string => {
  return "#" + colorElmToHex(color.r) + colorElmToHex(color.g) + colorElmToHex(color.b);
}
export const rgbToHue = (color: Color): number => {
  if(color.r > color.g && color.r > color.b) {
    let minCol = (color.g>color.b) ? color.b : color.g;
    return 60 * ((color.g-color.b)/(color.r-minCol));
  }
  if(color.g > color.b && color.g > color.r) {
    let minCol = (color.b>color.r) ? color.r : color.b;
    return 60 * ((color.b-color.r)/(color.g-minCol)) + 120;
  }
  if(color.b > color.r && color.b > color.g) {
    let minCol = (color.r>color.g) ? color.g : color.r;
    return 60 * ((color.r-color.g)/(color.b -minCol)) + 240;
  }
}
// hsb 各値 0~1に収まるように返します
export const rgbToHSB = (color: Color): Color => {
  let minCol = Math.min(color.r, color.b, color.g);
  let maxCol = Math.max(color.r, color.b, color.g);
  let hsbCol: Color = {
    r: rgbToHue(color)/360,
    g: (maxCol-minCol) / maxCol,
    b: maxCol / 255
  };
  return hsbCol;
}

export const paramsToURLParams = (params: Object): string => {
  const URLParams = [];
  Object.entries(params).forEach(([key, value]) => {
    if (isParamNum(value)) {
      URLParams.push(key+"="+value.val.toString());
    } else if (isColor(value)) {
      URLParams.push(key+"="+colorToHex(value).replace("#", ""));
    }
  });
  return "?" + URLParams.join("&");
}

export const URLParamsToParams = (params: Object) => {
  const URLParams = new URLSearchParams(window.location.search);
  Object.entries(params).forEach(([key, value]) => {
    const URLValue = URLParams.get(key);
    if (!URLValue) return;
    if (isParamNum(value)) {
      params[key].val = Number(URLValue);
    } else if (isColor(value)) {
      params[key] = hexToColor(URLValue);
    }
  });
}