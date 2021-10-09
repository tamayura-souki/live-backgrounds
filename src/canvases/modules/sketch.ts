import p5 from "p5";
import { FPS } from "./constants";
import { buildGUI, isGUIHidden, ParamsGUI, updateParamsByGUI } from "./gui";
import { URLParamsToParams } from "./param";

abstract class Sketch {
  // URLパラメータに使う用のやつ
  // 基本的に ColorかParamNumのメンバだけ持つ
  abstract params: Object | null;
  paramsGUI: ParamsGUI | null;
  readonly p5instance: p5;

  // パラメータが変更されて
  // ステータスを更新しないといけないときに呼ばれる
  abstract updateStat(p: p5): void;

  // 最初に1度だけ呼び出される処理
  abstract setup(p: p5): void;
  // 画面更新の処理
  abstract draw(p: p5): void;

  // p5jsのインスタンスつくるためのやつ;
  abstract sketch(p: p5): void;

  // 実際にp5jsのインスタンスをつくる
  // コンストラクタに組み込みたかったけど
  // 変数初期化のタイミングがコンストラクタの後っぽいので無理
  showSketch = () => {
    const sketch = (p: p5) => {
      this.sketch(p)
    }
    new p5(sketch)
  }
}

// 静止画用の抽象クラス
export abstract class StillSketch extends Sketch {
  sketch(p: p5) {
    if (this.params) {
      URLParamsToParams(this.params);
    }

    const updateStat = (p: p5) => {
      this.updateStat(p);
      this.draw(p);
    }

    let isGUIShown = this.params && !isGUIHidden();
    let prepareGUI = isGUIShown ? () => {
      this.paramsGUI = buildGUI(p, this.params);
    } : () => {};
    let handleGUI = isGUIShown ? () => {
      if(updateParamsByGUI(this.params, this.paramsGUI)) {
        updateStat(p);
      }
    } : () => {};

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.frameRate(FPS);

      prepareGUI();

      this.setup(p);
      updateStat(p);
    }

    p.draw = () => {
      handleGUI();
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      updateStat(p);
    }
  }
}

// アニメーション用の抽象クラス
export abstract class AnimationSketch extends Sketch {
  sketch(p: p5) {
    if (this.params) {
      URLParamsToParams(this.params);
    }

    let isGUIShown = this.params && !isGUIHidden();
    let prepareGUI = isGUIShown ? () => {
      this.paramsGUI = buildGUI(p, this.params);
    } : () => {};
    let handleGUI = isGUIShown ? () => {
      if(updateParamsByGUI(this.params, this.paramsGUI)) {
        this.updateStat(p);
      }
    } : () => {};

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.frameRate(FPS);

      prepareGUI();

      this.setup(p);
      this.updateStat(p);
    }

    p.draw = () => {
      handleGUI();
      this.draw(p);
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      this.updateStat(p);
    }
  }
}