import React from "react";

import { LightLinkOutSvg } from "@dndbeyond/character-components/es";

export enum CtaBannerOptions {
  NEW = "New",
  BETA = "Beta",
  ALPHA = "Alpha",
}

interface Props {
  preferenceEnabled: boolean;
  className: string;
  onPreferenceClick: () => void;
  preferenceTitle: string;
  linkHref?: string;
  linkTitle?: string;
  icon?: React.ReactNode;
  borderColor?: string;
  switchColor?: string;
  backgroundImageUrl?: string;
  bannerTitle?: CtaBannerOptions;
}
export default class CtaPreferenceManager extends React.PureComponent<
  Props,
  {}
> {
  static defaultProps = {
    className: "",
  };

  handlePreferenceToggle = (evt: React.MouseEvent): void => {
    const { onPreferenceClick } = this.props;

    evt.nativeEvent.stopImmediatePropagation();
    evt.stopPropagation();

    onPreferenceClick();
  };

  handlePreferenceSwitch = (evt: React.MouseEvent): void => {
    evt.nativeEvent.stopImmediatePropagation();
    evt.stopPropagation();
    //Needed to prevent the label from triggering the input onClick handler
    //https://stackoverflow.com/questions/24501497/why-the-onclick-element-will-trigger-twice-for-label-element
  };

  render() {
    const {
      preferenceEnabled,
      className,
      linkHref,
      linkTitle,
      icon,
      borderColor,
      switchColor,
      backgroundImageUrl,
      bannerTitle,
      preferenceTitle,
    } = this.props;

    const classNames: Array<string> = [className, "ct-cta-preference-manager"];

    return (
      <div
        className={classNames.join(" ")}
        style={borderColor ? { borderColor } : undefined}
      >
        <div
          className="ct-cta-preference-manager__primary"
          onClick={this.handlePreferenceToggle}
          style={
            backgroundImageUrl
              ? { backgroundImage: `url(${backgroundImageUrl})` }
              : undefined
          }
        >
          <div className="ct-cta-preference-manager__primary-info">
            {bannerTitle && (
              <div className="ct-cta-preference-manager__primary-info-banner">
                {bannerTitle}
              </div>
            )}
            <div className="ct-cta-preference-manager__primary-info-title">
              {icon && (
                <div className="ct-cta-preference-manager__primary-info-icon">
                  {icon}
                </div>
              )}
              <div className="ct-cta-preference-manager__primary-info-label">
                {preferenceTitle}
              </div>
            </div>
          </div>
          <label className="ct-cta-preference-manager__switch">
            <input
              className="ct-cta-preference-manager__switch-input"
              type="checkbox"
              checked={preferenceEnabled}
              onClick={this.handlePreferenceSwitch}
              onChange={() => {}}
            />
            <span
              style={
                preferenceEnabled && switchColor
                  ? { backgroundColor: switchColor }
                  : undefined
              }
              className="ct-cta-preference-manager__switch-slider"
            >
              {" "}
            </span>
          </label>
        </div>
        {linkHref && (
          <a
            className="ct-cta-preference-manager__link-out"
            href={linkHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="ct-cta-preference-manager__link-out-label">
              {linkTitle ? linkTitle : "Feedback Forum"}
            </span>
            <LightLinkOutSvg />
          </a>
        )}
      </div>
    );
  }
}
