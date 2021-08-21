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
export const codeToColor = (code: string): Color => {
  code = code.replace('#', '');
  code = code.toUpperCase();
  const c: Color = {
    r: parseInt(code[0]+code[1], 16),
    g: parseInt(code[2]+code[3], 16),
    b: parseInt(code[4]+code[5], 16)
  }
  return c;
}