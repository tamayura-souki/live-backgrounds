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