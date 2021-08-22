import p5 from "p5";
import { isParamNum, isColor, hexToColor, paramsToURLParams } from "./param";
import { parseBool } from "./utils";

const hiddenGUI = "hiddenGUI";

export type ParamGUIs = {
  [key: string]: p5.Element;
}

export const isHiddenGUIs = (): boolean => {
  const URLParams = new URLSearchParams(window.location.search);
  return parseBool(URLParams.get(hiddenGUI));
}

const copyURLwithParam = (params: Object) => {
  const URLParams = paramsToURLParams(params) + "&" + hiddenGUI + "=true";
  navigator.clipboard.writeText(location.origin+location.pathname+URLParams);
}

export const buildGUIs = (p5: p5, params: Object): ParamGUIs => {
  let paramGUIs: ParamGUIs = {};
  let i: number = 0;
  Object.entries(params).forEach(([key, value]) => {
    if (isParamNum(value)) {
      let slider = p5.createSlider(
        value.min, value.max, value.val,
        value.isInt ? 1 : 0
      );
      slider.position(10, 30*i+10);
      paramGUIs[key] = slider;
    }else if (isColor(value)) {
      let colorPicker = p5.createColorPicker(
        p5.color(value.r, value.g, value.b)
      );
      colorPicker.position(10, 30*i+10);
      paramGUIs[key] = colorPicker;
    }
    i++;
  });
  paramGUIs["button"] = p5.createButton("copy url");
  paramGUIs["button"].position(10,30*i+10);
  paramGUIs["button"].mousePressed(()=>{copyURLwithParam(params)});
  return paramGUIs;
}

export const updateGUIs = (params: Object, paramGUIs: ParamGUIs) => {
  Object.entries(params).forEach(([key, value]) => {
    if (isParamNum(value)) {
      params[key].val = paramGUIs[key].value();
    }else if (isColor(value)) {
      let code: string = paramGUIs[key].value().toString();
      params[key] = hexToColor(code);
    }
  });
}