import p5 from "p5";
import { isParamNum, eqColor, isColor, hexToColor, paramsToURLParams } from "./param";
import { parseBool } from "./utils";

const hideGUI = "hideGUI";

export type ParamsGUI = {
  [key: string]: p5.Element;
}

export const isGUIHidden = (): boolean => {
  const URLParams = new URLSearchParams(window.location.search);
  return parseBool(URLParams.get(hideGUI));
}

const copyURLwithParam = (params: Object) => {
  const URLParams = paramsToURLParams(params) + "&" + hideGUI + "=true";
  navigator.clipboard.writeText(location.origin+location.pathname+URLParams);
}

export const buildGUI = (p5: p5, params: Object): ParamsGUI => {
  let paramsGUI: ParamsGUI = {};
  let i: number = 0;
  Object.entries(params).forEach(([key, value]) => {
    const p = p5.createP(key);
    p.position(10, 30*i);
    i++;

    if (isParamNum(value)) {
      const slider = p5.createSlider(
        value.min, value.max, value.val,
        value.isInt ? 1 : 0
      );
      slider.position(10, 30*i+10);
      paramsGUI[key] = slider;
    }else if (isColor(value)) {
      const colorPicker = p5.createColorPicker(
        p5.color(value.r, value.g, value.b)
      );
      colorPicker.position(10, 30*i+10);
      paramsGUI[key] = colorPicker;
    }
    i++;
  });
  paramsGUI["button"] = p5.createButton("copy url");
  paramsGUI["button"].position(10,30*i+10);
  paramsGUI["button"].mousePressed(()=>{copyURLwithParam(params)});
  return paramsGUI;
}

export const updateParamsByGUI = (params: Object, paramsGUI: ParamsGUI): boolean => {
  let isChanged = false;
  Object.entries(params).forEach(([key, value]) => {
    if (isParamNum(value)) {
      isChanged = isChanged || params[key].val !== paramsGUI[key].value();
      params[key].val = paramsGUI[key].value();
    }else if (isColor(value)) {
      const code: string = paramsGUI[key].value().toString();
      const color = hexToColor(code)
      isChanged = isChanged || !eqColor(params[key], color);
      params[key] = color;
    }
  });
  return isChanged;
}