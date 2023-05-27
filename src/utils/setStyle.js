import colors from '@styles/colors';
// import fonts from '@assets/fonts';

//Use margin props with Elements having only a margin prop, declare separate style if other props are there

export function verticalMargin(top = 0, bottom = 0) {
  return {marginTop: top, marginBottom: bottom};
}

export function horizontalMargin(left = 0, right = 0) {
  return {marginLeft: left, marginRight: right};
}

export function setSmallFont(fontSize = 16, fontWeight = '500') {
  return {
    // fontFamily: fonts.SourceSansNormal,
    fontSize,
    fontWeight,
    color: colors.BLACK,
    lineHeight: 25,
  };
}

export function setMediumFont(fontSize = 18, fontWeight = '500') {
  return {
    // fontFamily: fonts.SourceSansBold,
    fontSize,
    fontWeight,
    color: colors.BLACK,
    lineHeight: 30,
  };
}

export function setLargeFont(fontSize = 30, fontWeight = '700') {
  return {
    // fontFamily: fonts.SourceSansBold,
    fontSize,
    fontWeight,
    color: colors.BLACK,
  };
}
