import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ScrollToTop from "../components/ScroolToTop";
const URL = import.meta.env.BACKEND_URL;
import useFetchhook from "../hooks/useFetchhook";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
const images = [
  {
    url: "http://localhost:4000/uploads/Nitro_V15_Hero_Banner_info.jpg",
    route: "/product/67f38af9a058d2c9bba4f56e",
  },

  {
    url: "http://localhost:4000/uploads/hero3.jpg",
    route: "/product/67f38af9a058d2c9bba4f56d",
  },
  {
    url: "http://localhost:4000/uploads/hero2.jpg",
    route: "/product/67f38af9a058d2c9bba4f565",
  },
  {
    url: "http://localhost:4000/uploads/68d5d84be6620470edc9f67e5b69d9df.jpg",
    route: "/product/67f38af9a058d2c9bba4f586",
  },
];

const category = [
  {
    image:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxESEBMUERMVFhUXGBYWFRcXFRoVGBUSGBgYGhgZGBUYHSoiGR4nGxkbITEhJSkrLi4uGB8zODMtNyguLi0BCgoKDg0OGxAQGy0lICU1LTcvKy03LS0tLS0tLS8tLS4tLS0tLS0tLS0tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALMBGQMBEQACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABQYEBwECAwj/xABIEAABAwICBQgFCQUHBQEAAAABAAIDBBEFIRIxQVFhBgcTIlJxgZEUMpKhsRcjQmJyk8HR8GSCsuHic4Ois7TC8SRTY4SjM//EABoBAQACAwEAAAAAAAAAAAAAAAAEBQEDBgL/xAA0EQEAAgECBAUDAgQGAwAAAAAAAQIDBBEFEiExEyJBUXEyYZGBoSOxwfAGFDM0QuEkYtH/2gAMAwEAAhEDEQA/AN4oCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg83zNBsXAHiQEHHpLO232ggeks7bfaCB6Sztt9oIHpLO232ggeks7bfaCB6QztN8wgekM7TfaCB6QztN8wg59IZ2m+YQPSGdpvmEHHpDO03zCB6QztN8wgekM7bfaCB6Sztt9oIHpMfbb7QQd2SB3qkHuN0HZAQEBAQEBAQEBAQEBAQEBAQEBB8787lLpYvVOdHpMDacONs23jyIds8cirPhtKWt54ifltpj5qzKjvw5oFwA5uoHRtnucPonh5XXZ4NDo71jfHXf4Q771nuyIIoTYGNgds6osfD9flq1HDNLH00j8MVmyyUeGUtVFotgjbOwagwDpG8LD1h7+8Kr/yuDFfzUjb47IeXLfT5N5nes/sYThdOeq+CIvZn6jfnGccvWH5Fbs2h08eatI2n7dpbc2S1qb0lxj/ACfgYWvZEwNIsbNAFjqd+t3FZ0ul00xNbUjf4V1NVl32m0q7S0UbZ2B7Glpdouu0WzyB8yD4KxycO0k4pmuOv4WODNNpjqmqLCIdOzoo9ZGbB3buPuUDJo9Py7xjj8LD0YmK4XEGxaMTBcPJs0C9r2utmm0Wmnn3x1/Cv1GW0TG0sTDsNjdLYsba7j6o1A2Wy+h0sR/p1/CPm1F60md1ii5Nwm3zMe/1R4KLOm00f8K/hUzxLL25pYhwSB0htGzQYOsQ0C/8yVr1Gn09Me0Y45p7dHT8JrbL5sk9Fi5O8j4H3llgjsfVaWC1t9rfrWqPiEY8cRgxRHN6z7Ogpjxd5rCdrOTVBG0j0WAuOv5puX1Rlr37tQzWrDhrWIiY3e6YMd535Y2V5/J+nkeQynhG8iNoAGvIge/wG0mVljBp6c14jdLpo8Uea9Y+ElHyVomMu+CK2u5jbpO+zcdVvFc7fJkz5PJG3w83x6eJnakf0hauaFsQFeIWtbH6Q3RawWaB0EWrxzUqcdsflt3UGpiIyTFezYSw0CAgICAgICAgICAgICAgICAgINTY5QRT4viDCQJdGmLBkC5vRHSDXeXVNwdys9Ba1Kzbbp6vE6mcN49pUXGcEdC4lg13FrdV1sy0t2OHZ8WldFi4jyV88dP3j7pXg1zRzVlWamAOBezK1tNu1hOog7Wnfs1HYTP5656/V37T/fqjTXknaYe2HVjgRY2kbm12q9tij3xzy8so+WtbRtMdJ7rh04njbUR5SNI0wO32rbnWIPEHeo+DJvHJbtKvpE4r+FPb0lm6bZouDgTbsn6TfAi/gU2nHf4RtTj8O3RSsUgI7xdp726vcrvDaNtm7DbqnqV+k5rx9LQf5gE+9V9/p5fZd1nerHxfVFwDvis6WfqVmp+qGHgbNZPAeJzPxWbzvKDq58uyyTV4ETiNuQ4DV+B81ojH5o3VeDTTbJEPXA6HpJBGdQ68nE7vw9pVup1PJW2WfiHeaWnh1jHC8SyiKMO1Ejq/Vbv78vcTsVHSNt727/zW1K89uWO0K8ZjK4tGTRk53+0fjvz8d98saeniX7z2hZViterNnfHBFpOFgbaDbazsJA1k7AqjDGTWZev6/ZGz6jv/AH+FZxTEi4F8zrN7Ou52D6xt+6OOSua46Yq7VhFiZmd7fhcuZSoEkVa8CwM7bC98hDGNe1V+ad7bq3UzvkmWyFqRxAQEBAQEBAQEBAQEBAQEBAQEHz/zmzOZjdTJG4h7G07suz0YzHcbea6r/D1a3x5KWjpKLqJ6xE9lgE7K+i6e3WFmzga7/RkHEHP/AJK1ZsE6fLOKe09v/ho8847cktbYvEYZOksDokslbseDr8HA3777lq02acN5xb9J6x9lvqKc9eeO8fyRdXF0cnVNxk5h3scAWnyOfiryM/PWJlV2r6LRyTqfnSw+rILeJ1eOlb3qFk8t94+ULUV3pzesJKmJZJIzjpDx1jy+KlX81Ys05/Pj5kRjMXXeN4a7/afipWC3lhGwz2emFvvGw7hbyc4fABecsbTK7xz0elfTvk0WxtLnXcAGgkk6Q1AZlaqZK462m07IWeN7xELDgvN/XuYCYwzO/XcG7LC41jyVdbi2Ctu+/wAPGTR3u8MXwYQ6LTPC9wObYy5+rWC7R0dh2r1GsnJWZisxHvLOm00UyRvMJrkpS9S51yPz7gbfG/mqvXTvNaekdV9prea1nHKnEDpWbvAb3/R8gL94O9a6Yea0RPaFtgtyR92VglABotPqtGk/jwPeVQa/UTmzbR8QkXvNKb+6uYriPTzueT1G3DdwAyLu/YPLcug0unjT4Yx+s91ZE81t/bsqsj3VU4aPVGVtzd35qHrdVGLHNvwmabH4l+vb1bh5oqYRtrmD6M7B49BET8VW6bJOTFFp9VdxCY/zFtmwVIQhAQEBAQEBAQEBAQEBAQEBAQEHzrzsS6GOTu+rDfiDEAR5Lrf8ORvjvCPqKxarK5sKrQq3QE9SUOjI8CWlT+NYubDGWO8dVfadpizD5U0ejI9p2tcw/aj6w8mOLfBUOpjetckOi0mTnrtPqp8ucMZ2tL4z3Ahzf4nDwCk4skxvCLlr0SOAOIewjWL28CD+K25Z+mZ+PygZu1o+y6YnBaqaRqdcedz8FIw33wzHshUnmxIbGm2e3i1w8jdStPPRFxer35I4VJUlscTbnSPcADcknYM1r1mophrNrSvcPWraYNFhEZv85UO2DN7rkZDsNvbv4rmJnPrbe1f2e5mtPlimjr69unVvFLT2J0NXV+sDbZ2j4LNcmDT9Mcc1vdqvS+T6p2h4vpcPjaTDTvqtAHSkcSIm213dk1x4AFe5yajJMRe3Lv6erGKmPH9PUwxtmxkADqOdYCwBc3UBsFz7l5yR/En9E7TT5P1VaUdJWMGzSJ8NnxW/N/DwWv8Ab+a1xdbJ7Fpuioql41k9GO7IH+InwXN8LweLq4me0dWzVW6RDXWJy9HAeOR8P55rp8/rKNSdq7srkPTa3nXr8b2Hkc1xvGcszblWOittjmfds3mnfpenn9ob7oYx+ClaOvLhrCp4h/uJX9SUIQEBAQEBAQEBAQEBAQEBAQEBB87c7kV8Yqfswf5QXXf4a+i/y15Oznm+pC6viI2OB8mi6suLXiummFVm67R90xy9px6S48ZD5xPP4hc/SvPp4heaGNtmuXRfNP8A7Ufwuv8AEKzppfPHw1Z7x1+ZSnJmnu8f3n8P/C1a2nLFa/eFdltvE/Da8mGwTdGxzxHMyxjJsGyi2bCd972Kr4zZMW8xG9Z7/b7tOkit8W093nPyGZVtBY/opYyWyRvFxcj1gdYB17dqV4pfBO09YntLZi01bR06T6pHBYW07HUuGgPeD/1FS71GutnnqNtg2cc1Hz3nNbxdRPT0r6rCkREbQwarF6OidI6Miepvd80lyxjjb1bXLj3eYW6un1GorETHLX0iGrJlpS0RPdj4Ti3p07Glr6l5zvL1IYwCLubTsJvYbXG5yWM2mtp8czvFfjvP6tUZYvfliN03y6xIXZSR2FxpPtkAALsbYcc/ALTw/BM/xrfo25skRHLDvT0/Vj/swPcD+CxafNPylaP/AE4VKjpNGvZfgPHqrfrZ30Vlthj6pS/KejJoJbbJXE936sqXgdojUfoxqJ57R8Q17ygoj0Rt+sx+a6DJtaXqcNvDTvJKkLYTlrafwXDcUr/5H6puCk0pG64c0jLCvB2VDf8AJjVvWIildvZU8R/3E/o2CsoIgICAgICAgICAgICAgICAgICDQ3OPSGTGKoAXygH/AMmrqOAZIpjv8vNq7wtvN9yeNO0zyCxt1d/ErTxXWxmnw6oE45tkhT+Wdf0kryzO9wLZ3uRe2/U1o4NdvCsNDpvLHN6LOl4xVmZ9FVr6bomMjPrC7n8Hutl4AAd4KtK2id7+nor+uSye5GUBc8DedH3h0h8AGg96otfl5ssRH/HrP9EPWW8PFaZ9ei84jBpTg7GtJ8TkPxWjFfbHt7q7xPDxolmOyUtWwtN29G7TYTYOY52rhrBB2KTOjpnxe079HrR6u1PNPV70XKkQxdE1rZqZ56rHt0HtaXAaJc3WQ6+ed7XWm/DpyTzW8t4/WHQYskcvR2nOETGXpGzwm50tEh7dYzF7ndsWaxrscRy7WRs84JtHP0lL4bjGHUUBFDeWQj1nAg/vEgZcB/NQ76bVanJvm6Q8ZNVh01Z5O6H6N7p2SPJJJOkTtvfP3qw8tcc0r6KnRazxMk8091zpGfNR/V6p/hVJk+uXUaC+9ZhAcoaJzJWTNGog5eJ+F/ZUrFaMmO2KfVe6WYmZj3TwibLG9v0ZWh7T9awv8AVzeGbaXP19EfLEx8wpFdhLtEscM25Hu1A+OXiAuhrljff0T8GSLR1duSh0HdFJ4biP18VScY03P56JOaPJEwtvN9DoTYi3dPH/AKeJedNabYo3c7qr82WZXNb0cQEBAQEBAQEBAQEBAQEBAQEBBRYKRjsUxBxiDyHUwBOYHzDTqUrBktWs1i2yJqstqREVSmKwSysLbtaNRBOjccbbOC3YrUxzuiU1E7+boq0vJKQXLXxMJ+nZz3DuOod4F+KsY4hE94mft2S5vjyR0mZ29EJJyHgDtKWpLjwA9wupM8QyXjatdkLNxLkjlrXZYsHw+ngHzYJNrAnY3cBbLadpNzmoNovbu53VcSi997dXrUte4kMaDvOfvsLe8LNeWO8vFMl88dIlWcRwpxke5723OvR6xA3XyaPMqxxamIiIrH5/vdaabRzMRzTsxI8NJ0A0WjjAJJJJIDtLcMy7ats54jeZ7yv6UiK9HWDC5JHTZDrH4/zC9TnpSKwqOIxO8Wh50eBVEZ1ZHLb71m2qx2Vua8Wjed1uoIXaDRIACNRGarcto38qj8aKZN6zKx4XUg3ALTfXna57lWZ8e3V0/D+IX36zCTkp2ubouAIPE+4qNFpjrDpcWs2mJdqPDGsbot1XuBrAPDIWWnLEZLb2jql31E36yq/KnlJh8DtGV2k4ZHRHqnaNK/uzUvBhycu2+0fdFpr6RblrvO3s64F6DWi8DwSMy0mzm8bW94KxnxWrG146fsscfELbdElyNh0KrEm3vaaHP/1olCisVjaETLfntzLYstYgICAgICAgICAgICAgICAgICDXVTW9HiWIC2t1Odv/AGGKw0WHniZc9xrN4dqx9mXFiBOqw8gpk4IhzNtbk36dENykr3OGi1jpDuGpStNhrE72nZf8Hy5r77ygWyzBvzsjIW7A3rO7t11Mnw5+iJlMzcPjJbeyXwTFYtTNKQ9p5v7tQUTUYcne3T7QhZOHY6z5a7pCuxVtwHEud9Fjdvh+gtGPBPeO3ustLpPLvbswG1rHOAdZxvYAZtB3DtHj3cFtmlojp0S6xX0ekuIQ20GEHMlxG22v4EeaxTFk+uzdaemztBNa5vtsf8d/4fesXid0DVU5qJegmvmbbnD6w/V1HvXboorTNfq7OuLstZzdS94J36WVuXT033hjxV8bfWsDvXq2K09m/S4ot9UMmPlBZ1vffLzUbLgitZtLqdHp/F2iJSFVjkoieC2xIs1w3nIfFVM58EWiYlP1umy0015r3iHz/i+HxVMwfLWMa5zwHxuLR0LOka1wF362BxJBALiwkXvdZtkm/V40uKuLFFYTnINgpayB1PUCW7wHgFp0WucG2Ja4gggndm2+ogqXp781LUt2/qssOKtsWS9u1Y33bn5ISaVXiZ3zQ/6aJRbxtOyFS8XrzVWpeHsQEBAQEBAQEBAQEBAQEBAQEBBpnlcHHFqwB+iPmLjWT8wz6IzV/wAJvWuK28b9VPxLTeLaPh2gxeCIZuLiNe34G3mQplsWTJPTpCsrw2kTvMboXGuVUknViFgcshr7ss/AHvUrBoKV63ldaWkY46RsgQNIkyuLjtF8h3k3A7jpHgFN3iI2p/f9/olTE2lIUmIPddsVmtHrPOTWjfnrO69zuWq+Klet53n2e5pTH1t1n29HpJWhoIaTY5OefXkO7gOGzK+xp1xTmnrt8ekImS83l1q6sxMGdpZW3H/hp9r/ALThk3gb5l10x44y3/8AWv729viHqI5Y2RGEVjnSi2QL2MA3MHWd5Mbb95WGpx0rj237RMz8+n7z+xCfocccYZHHWI2y+UzQfc8qtyaesZIjf12/Zrt1rKXwbGwJNFx6ruoTuc31XezY+BUfPpt6c0d4UerxzvMbJSvxFzSQRmNY3jetGPFW0bxKojHeZ5ZiUJiVVdhezNu0dnv3d/mpWOI32lZaHetuS8fEoGPE3tddhJAObTs/EeGXArGprW1Jh1GkjkvEz+Vih5S6TLXsd2/u2HwsVxebRVteXSzkry+brCAxykoKpxkqI5GTH13w2tId74yRZx2kXuos6fV4emPaa/fvCB/Am3Vg4ZTiBwdBcNabtIOelvJByPC62482THO9u6de2G+HwKR5Z7/dtbmeqnyiufI4ucZo7k2ubQsA1KTN5v1lTWw1w+SsbQ2KsMCAgICAgICAgICAgICAgICAgIKVyl5saCuqX1E5mEjw0O0JNFpDWhoytuCzFpjtIi/kTwrfU/ff0r14l/eWNocjmUwrfU/ff0p4l/eTaAcymFftH339KeJf3lk+RXCv2j77+lPEv7yOfkVwr9o++/pTxL+8sbQHmVwo6/SPvv6UjJeO0yzs1Hzi8loaKukgptPRa2MjTeSbuaC7MWSct59ZY2Vf0YWaGk6Rydcm1twAK8+Jkmesttox8nTfds3ms5v6KvhndUdLpRyNa3QkLeqWg5jPO91nnv7y1csey8/Izhe+p+/P5Jz292OWvsfIxhe+o+/P5Jz29zlr7OBzLYV+0ffH8k57e7Ox8i+FftH3x/JY3l6iZc/IvhW6o++P5JvLDkczOFbp/vj+SwzvKz8lOSlNh0cjKbTs92m7TdpHSsBr7gjCdQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEHz5zwODcXlvtZEdRNhoWz8igolPA0EOuSBn6rvyTds8K+2+zc/MJM0xVgBzD4yRncAtcAe42PkjW2ugICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgg8W5WUdPcPlDnD6DOu6+42yHiQgp2Lc5MhuKeMMHaf1neyMh43Qa1x6pdVTOmlcZHgAPcBezRvDRZozO5ZEMyuIb0ccbL6g7R0nm+wa9fBedm6ue9I2r0bG5N8lsawsdPTshl6VrTJEMy0aw1wJGYuc2k7UaVqoOc6NrhHX08tM/bdpc3yIDvce9ZFzwzF6eobpQSskH1XAkd41jxQZqAgICAgICAgICAgICAgICAgICAgICAgICAgjcVx6lph8/Mxp7N7uPcwZ+5BTMV5z230aWEknU6TK/dG3M+YQQssOM1/rNl0Dsd/08dvsmxd4goJDDubGY5z1DGDsxN0z7b7AeyUFgpOQGHQjSfG6YjbM4vB/uxZn+FGaxv0Y1byjjhtFBowi9rGDQYN2WV/BaJyzutsHDuavNaN/iUNgODGiqJainErjLcFvRNbG3Sc1x0Bp3FyONrrPPZ5jTYZnrO36/8AS1S8p5W5Gkmc76rbtPc42t5J4kx6PEaGk9fEjZL2ZUR2mhBadbJGhw8Qcltid4QcmOKTtE7q9X83FC92nD0lNJrDoXkWP2TcD92yy1vBlBjdJ/8AlPFWRj6Mo0JLcHXzPe5B7xcvGRkNr6aald2nNL478JG60Fmw/FIJ26UMrJB9VwNu8awgy0BAQEBAQEBAQEBAQEBAQEBAQEBAQEFPxHA8UqCQ+tjhZ2YWOGXEkh1/3rIOlBzb0bDeV0kztZ0naDb9zLE+JKCzYfhNPALQQxx/ZYGk95GZ8UGagIOCEHm6nYdbQe8XWNoeovaO0uehbuHkm0Mc0+7vZZYLIOUBB1ewOBDgCDrBFwfBBXMQ5C0MjtNkZgk2PgcYiDv0R1b8bIO+FYPWwSNvXdND9JksQMluErXA34m/cgsSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg//2Q==",
    title: "Computer",
    url: "/computer",
  },
  {
    image:
      "data:image/jpeg;base64,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",
    title: "Drone",
    url: "/drones",
  },
  {
    image:
      "https://c8.alamy.com/comp/2BD0N5H/apple-iphone-11-isolated-on-white-background-with-reflection-2BD0N5H.jpg",
    title: "Mobile",
    url: "/mobile",
  },
  {
    image: "2.png",
    title: "Audio",
    url: "/audio",
  },
];
const Home = () => {
  const fetchOptions = useMemo(
    () => ({
      method: "GET",
    }),
    []
  );
  const navigate = useNavigate();

  const {
    data: product,
    loading,
    error,
  } = useFetchhook("/products", fetchOptions);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);
  const minSwipeDistance = 30;
  // const [product, Setproduct] = useState([]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {

  //     } catch (err) {
  //       console.error("Error fetching products:", err);
  //     }
  //   };

  // }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <>
      {" "}
      <ScrollToTop />
      {/* Hero Carousel Section */}
      <section
        className="relative w-full overflow-hidden touch-pan-x" // Added touch-pan-x for better swipe handling
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Blurred Background Layer - Hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden z-0 max-sm:hidden">
          <img
            src={images[current].url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover filter blur-3xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Foreground Slides */}
        <div
          className="relative z-10 flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex justify-center px-4"
            >
              <Link
                to={item.route}
                className="block rounded-lg overflow-hidden touch-pan-x" // Added touch-pan-x
              >
                <img
                  src={item.url}
                  alt={`Slide ${index + 1}`}
                  draggable="false"
                  className="w-full max-w-6xl h-[50vh] sm:h-[60vh] lg:h-[70vh] object-cover"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Arrows – same size, improved style */}
        <div className="hidden sm:flex absolute top-1/2 left-0 right-0 justify-between px-8 transform -translate-y-1/2 z-10">
          <button
            onClick={prevSlide}
            className="rounded-full bg-white/10 backdrop-blur-md text-white p-4 hover:bg-white/20 transition-all duration-300"
            aria-label="Previous slide"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="rounded-full bg-white/10 backdrop-blur-md text-white p-4 hover:bg-white/20 transition-all duration-300"
            aria-label="Next slide"
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      </section>
      {/* Promotional Cards Section */}
      <section className="bg-gradient-to-b from-gray-100 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Holiday Deals Card */}
            <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-2xl overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative z-10 p-8 lg:p-12">
                <div className="max-w-sm">
                  <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                    Holiday Deals
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Up to 30% off
                  </h2>
                  <p className="text-white/90 text-lg mb-8">
                    Selected Smartphone Brands
                  </p>
                  <button
                    onClick={() => navigate("/mobile")}
                    className="bg-white px-8 py-3 rounded-full font-semibold text-red-600 shadow-xl hover:bg-transparent hover:text-white border-2 border-transparent hover:border-white transition-all duration-300"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
              <img
                src="/1.png"
                alt="Smartphone"
                className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-left opacity-90"
              />
            </div>

            {/* Audio Gear Card */}
            <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative z-10 p-8 lg:p-12">
                <div className="max-w-sm">
                  <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                    Just In
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Premium Audio
                  </h2>
                  <p className="text-white/90 text-lg mb-8">
                    Top Headphone Brands
                  </p>
                  <button
                    onClick={() => navigate("/audio")}
                    className="bg-white px-8 py-3 rounded-full font-semibold text-purple-600 shadow-xl hover:bg-transparent hover:text-white border-2 border-transparent hover:border-white transition-all duration-300"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
              <img
                src="/2.png"
                alt="Headphones"
                className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-left opacity-90"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-16">
            <span className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 [text-shadow:_0_2px_8px_rgba(255,255,255,0.2)] hover:[text-shadow:_0_2px_12px_rgba(255,255,255,0.3)] transition-all duration-300">
              Shop by Categories
            </span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {category.map((cat, index) => (
              <button
                key={index}
                onClick={() => navigate(cat.url)}
                className="group relative aspect-square rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {cat.title}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Top Deals Section */}
      <section className="py-20 mt-7 bg-gradient-to-br from-gray-600/80 via-gray-900 to-gray-400/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-16">
            <span className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200">
              Top Deals
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {product?.map((product) => (
              <div className="transform transition-all duration-300 hover:-translate-y-2">
                <Card
                  key={product._id}
                  id={product._id}
                  image={product.image}
                  title={product.title}
                  badge={product.badge}
                  tags={product.tags}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
