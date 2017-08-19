using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DocumentFormat.OpenXml;
using System.Drawing;
using DocumentFormat.OpenXml.Packaging;

namespace DocumentEditor.Excel
{
    public class ThemeColor
    {
        /// <summary>
        /// 读取Excel主题色
        /// </summary>
        /// <param name="theme"></param>
        /// <param name="tint"></param>
        /// <returns></returns>
        public static string GetThemColor(UInt32Value theme, DoubleValue tint)
        {
            int themeIndex = (int)theme.Value;
            double tintIndex = 0;
            if (tint != null) { tintIndex = (double)tint.Value; }
            string colorStr = string.Empty;

            switch (themeIndex)
            {
                case 0:
                    #region 白色系
                    if (tintIndex == 0)
                    {
                        colorStr = "#ffffff";
                    }
                    else if (tintIndex == -4.9989318521683403E-2)
                    {
                        colorStr = "#f2f2f2";
                    }
                    else if (tintIndex == -0.14999847407452621)
                    {
                        colorStr = "#d9d9d9";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#bfbfbf";
                    }
                    else if (tintIndex == -0.34998626667073579)
                    {
                        colorStr = "#a6a6a6";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#808080";
                    }
                    #endregion
                    break;
                case 1:
                    #region 黑色系
                    if (tintIndex == 0)
                    {
                        colorStr = "#000000";
                    }
                    else if (tintIndex == 0.499984740745262)
                    {
                        colorStr = "#808080";
                    }
                    else if (tintIndex == 0.34998626667073579)
                    {
                        colorStr = "#595959";
                    }
                    else if (tintIndex == 0.249977111117893)
                    {
                        colorStr = "#404040";
                    }
                    else if (tintIndex == 0.14999847407452621)
                    {
                        colorStr = "#262626";
                    }
                    else if (tintIndex == 4.9989318521683403E-2)
                    {
                        colorStr = "#0d0d0d";
                    }
                    #endregion
                    break;
                case 2:
                    #region 棕色系
                    if (tintIndex == 0)
                    {
                        colorStr = "#eeece1";
                    }
                    else if (tintIndex == -9.9978637043366805E-2)
                    {
                        colorStr = "#ddd9c4";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#c4bd97";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#948a54";
                    }
                    else if (tintIndex == -0.749992370372631)
                    {
                        colorStr = "#494529";
                    }
                    else if (tintIndex == -0.89999084444715716)
                    {
                        colorStr = "#1d1b10";
                    }
                    #endregion
                    break;
                case 3:
                    #region 深蓝色
                    if (tintIndex == 0)
                    {
                        colorStr = "#1f497d";
                    }
                    else if (tintIndex == 0.79998168889431442)
                    {
                        colorStr = "#c5d9f1";
                    }
                    else if (tintIndex == 0.59999389629810485)
                    {
                        colorStr = "#8db4e2";
                    }
                    else if (tintIndex == 0.39997558519241921)
                    {
                        colorStr = "#538dd5";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#16365c";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#0f243e";
                    }
                    #endregion
                    break;
                case 4:
                    #region 天蓝色
                    if (tintIndex == 0)
                    {
                        colorStr = "#4f81bd";
                    }
                    else if (tintIndex == 0.79998168889431442)
                    {
                        colorStr = "#dce6f1";
                    }
                    else if (tintIndex == 0.59999389629810485)
                    {
                        colorStr = "#b8cce4";
                    }
                    else if (tintIndex == 0.39997558519241921)
                    {
                        colorStr = "#95b3d7";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#366092";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#244062";
                    }
                    #endregion
                    break;
                case 5:
                    #region 红色系
                    if (tintIndex == 0)
                    {
                        colorStr = "#c0504d";
                    }
                    else if (tintIndex == 0.79998168889431442)
                    {
                        colorStr = "#f2dcdb";
                    }
                    else if (tintIndex == 0.59999389629810485)
                    {
                        colorStr = "#e6b8b7";
                    }
                    else if (tintIndex == 0.39997558519241921)
                    {
                        colorStr = "#da9694";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#963634";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#632523";
                    }
                    #endregion
                    break;
                case 6:
                    #region 绿色系
                    if (tintIndex == 0)
                    {
                        colorStr = "#9bbb59";
                    }
                    else if (tintIndex == 0.79998168889431442)
                    {
                        colorStr = "#ebf1de";
                    }
                    else if (tintIndex == 0.59999389629810485)
                    {
                        colorStr = "#d8e4bc";
                    }
                    else if (tintIndex == 0.39997558519241921)
                    {
                        colorStr = "#c4d79b";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#76933c";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#4f6228";
                    }
                    #endregion
                    break;
                case 7:
                    #region 紫色系
                    if (tintIndex == 0)
                    {
                        colorStr = "#8064a2";
                    }
                    else if (tintIndex == 0.79998168889431442)
                    {
                        colorStr = "#e4dfec";
                    }
                    else if (tintIndex == 0.59999389629810485)
                    {
                        colorStr = "#ccc0da";
                    }
                    else if (tintIndex == 0.39997558519241921)
                    {
                        colorStr = "#b1a0c7";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#60497a";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#403151";
                    }
                    #endregion
                    break;
                case 8:
                    #region 青色系
                    if (tintIndex == 0)
                    {
                        colorStr = "#4bacc6";
                    }
                    else if (tintIndex == 0.79998168889431442)
                    {
                        colorStr = "#daeef3";
                    }
                    else if (tintIndex == 0.59999389629810485)
                    {
                        colorStr = "#b7dee8";
                    }
                    else if (tintIndex == 0.39997558519241921)
                    {
                        colorStr = "#92cddc";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#31869b";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#215967";
                    }
                    #endregion
                    break;
                case 9:
                    #region 橙色系
                    if (tintIndex == 0)
                    {
                        colorStr = "#f79646";
                    }
                    else if (tintIndex == 0.79998168889431442)
                    {
                        colorStr = "#fde9d9";
                    }
                    else if (tintIndex == 0.59999389629810485)
                    {
                        colorStr = "#fcd5b4";
                    }
                    else if (tintIndex == 0.39997558519241921)
                    {
                        colorStr = "#fabf8f";
                    }
                    else if (tintIndex == -0.249977111117893)
                    {
                        colorStr = "#e26b0a";
                    }
                    else if (tintIndex == -0.499984740745262)
                    {
                        colorStr = "#974706";
                    }
                    #endregion
                    break;
                default:
                    break;
            }
            return colorStr;
        }

        public static string[] GetThemeColorList(ThemePart themPart)
        {
            var themColorList = (((DocumentFormat.OpenXml.Drawing.ThemeElements)(themPart.Theme.ChildElements[0])).ColorScheme).ChildElements;
            var themColor = new string[10];
            for (int i = 0; i < themColor.Count(); i++)
            {
                if (i < 2)
                {
                    themColor[0] = ((DocumentFormat.OpenXml.Drawing.SystemColor)((themColorList[1]).ChildElements[0])).LastColor;
                    themColor[1] = ((DocumentFormat.OpenXml.Drawing.SystemColor)((themColorList[0]).ChildElements[0])).LastColor;
                }
                else
                {
                    if (i < 4)
                    {
                        themColor[2] = ((DocumentFormat.OpenXml.Drawing.RgbColorModelHex)((themColorList[3]).ChildElements[0])).Val;
                        themColor[3] = ((DocumentFormat.OpenXml.Drawing.RgbColorModelHex)((themColorList[2]).ChildElements[0])).Val;
                    }
                    else
                    {
                        themColor[i] = ((DocumentFormat.OpenXml.Drawing.RgbColorModelHex)((themColorList[i]).ChildElements[0])).Val;
                    }
                }
            }
            return themColor;
        }

        /// <summary>
        /// 转换主题色
        /// </summary>
        /// <param name="themeIndex">主题色索引</param>
        /// <param name="tint">主题色百分比</param>
        /// <param name="themColor">主题色色值</param>
        /// <returns>返回Rgb格式颜色</returns>
        internal static System.Drawing.Color ThemColorDeal(UInt32Value themeIndex, DoubleValue tint, string themColor)
        {
            #region 主题色处理
            var val = double.Parse(tint.Value.ToString());
            var persent = int.Parse((double.Parse(val.ToString("0.00")) * 100).ToString());
            var rgbColor = ThemeColor.Hx16ToRgb("#" + themColor);
            int h, s, v;
            ThemeColor.RgbToHsv(rgbColor.R, rgbColor.G, rgbColor.B, out h, out s, out v);
            if (themeIndex > 1)
            {
                if (persent == 80)
                {
                    s = Convert.ToInt32(s * 0.2);
                    v = 95;
                }
                else if (persent == 60)
                {
                    s = Convert.ToInt32(s * 0.4);
                    v = 89;
                }
                else if (persent == 40)
                {
                    s = Convert.ToInt32(s * 0.6);
                    v = 84;
                }
                else if (persent < 0)
                {
                    s = s + 5;
                    v = Convert.ToInt32(Convert.ToDouble((persent + 100)) / 100 * v);
                }
            }
            else
            {
                if (val < 0)
                {
                    v = 100 + persent;
                }
                else
                {
                    v = v - persent;
                }
                if (v < 0)
                {
                    v = v * -1;
                }
            }
            #endregion
            return ThemeColor.HsvToRgb(h, s, v);
        }

        /// <summary>
        /// 将16进制颜色转为Rgb格式
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Color Hx16ToRgb(string value)
        {
            int r = Convert.ToInt32("0x" + value.Substring(1, 2), 16);
            int g = Convert.ToInt32("0x" + value.Substring(3, 2), 16);
            int b = Convert.ToInt32("0x" + value.Substring(5, 2), 16);
            return Color.FromArgb(r, g, b);
        }

        /// <summary>
        /// 将Rgb格式转为16进制颜色
        /// </summary>
        /// <param name="R"></param>
        /// <param name="G"></param>
        /// <param name="B"></param>
        /// <returns></returns>
        public static string RgbToHx16(int R, int G, int B)
        {
            return ColorTranslator.ToHtml(System.Drawing.Color.FromArgb(R, G, B));
        }

        /// <summary>
        /// 将rgb转为hsv
        /// </summary>
        /// <param name="R"></param>
        /// <param name="G"></param>
        /// <param name="B"></param>
        public static void RgbToHsv(int R, int G, int B, out int H, out int S, out int V)
        {
            Color MyColor = Color.FromArgb(R, G, B);
            H = Convert.ToInt32(MyColor.GetHue());

            decimal min;
            decimal max;
            decimal delta;

            decimal r = Convert.ToDecimal(R) / 255;
            decimal g = Convert.ToDecimal(G) / 255;
            decimal b = Convert.ToDecimal(B) / 255;

            min = Math.Min(Math.Min(r, g), b);
            max = Math.Max(Math.Max(r, g), b);
            V = Convert.ToInt32(max * 100);
            delta = (max - min) * 100;

            if (max == 0 || delta == 0)
                S = 0;
            else
            {
                S = Convert.ToInt32(delta / max);
            }
        }

        /// <summary>
        /// 将hsv转为rgb
        /// </summary>
        /// <param name="H"></param>
        /// <param name="S"></param>
        /// <param name="V"></param>
        /// <returns></returns>
        public static Color HsvToRgb(int H, int S, int V)
        {
            H = Convert.ToInt32(Convert.ToDecimal(H) / 360 * 255);
            S = Convert.ToInt32(Convert.ToDecimal(S) / 100 * 255);
            V = Convert.ToInt32(Convert.ToDecimal(V) / 100 * 255);

            int R, G, B;

            if (S == 0)
            {
                R = 0;
                G = 0;
                B = 0;
            }

            decimal fractionalSector;
            decimal sectorNumber;
            decimal sectorPos;
            sectorPos = (Convert.ToDecimal(H) / 255 * 360) / 60;
            sectorNumber = Convert.ToInt32(Math.Floor(Convert.ToDouble(sectorPos)));
            fractionalSector = sectorPos - sectorNumber;

            decimal p;
            decimal q;
            decimal t;

            decimal r = 0;
            decimal g = 0;
            decimal b = 0;
            decimal ss = Convert.ToDecimal(S) / 255;
            decimal vv = Convert.ToDecimal(V) / 255;

            p = vv * (1 - ss);
            q = vv * (1 - (ss * fractionalSector));
            t = vv * (1 - (ss * (1 - fractionalSector)));

            switch (Convert.ToInt32(sectorNumber))
            {
                case 0:
                    r = vv;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = vv;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = vv;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = vv;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = vv;
                    break;
                case 5:
                    r = vv;
                    g = p;
                    b = q;
                    break;
            }
            R = Convert.ToInt32(r * 255);
            G = Convert.ToInt32(g * 255);
            B = Convert.ToInt32(b * 255);
            return Color.FromArgb(R, G, B);
        }
    }
}
