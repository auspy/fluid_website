import { useEffect, useState } from "react";

export default function Hero() {
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [initialDistance, setInitialDistance] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isDesktop = screenWidth > 1100;
  const isMobile = screenWidth < 760;

  const MAX_ZOOM = isMobile ? 1.5 : 4.0;
  const calculateDistance = (touches) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  const paddingValue = () => {
    return isDesktop ? 120 : isMobile ? 20 : 30;
  };
  const resetOnResize = () => {
    const newZoomFactor = 1.0;
    setZoomFactor(newZoomFactor);
    const wrapper = document.getElementById("wrapper");
    wrapper.style.transform = `scale(${newZoomFactor})`;
    wrapper.style.width = `${100 / newZoomFactor}%`;
    handleHeroOnZoom(1);

    // reset padding of wrapper
    // const wrapper = document.getElementById("wrapper");
    // if (wrapper) {
    //   const existingPadding = wrapper.style.paddingInline;
    //   const correctPadding = paddingValue();
    //   if (existingPadding !== `${correctPadding}px`) {
    //     wrapper.style.paddingInline = `${correctPadding}px`;
    //   }
    // }

    // // reset height of hero images based on h-[400px] sm:h-[500px] md:h-[524px]
    // const heroImage = document.getElementById("hero-images");
    // if (heroImage) {
    //   if (isMobile) {
    //     heroImage.style.height = "400px";
    //   } else {
    //     heroImage.style.height = "520px";
    //   }
    // }
  };

  const handleHeroOnZoom = (zoom) => {
    const zoomIs = zoom || zoomFactor;
    // switch from flex row to flex column when zoom is above 1.
    const heroGrid = document.getElementById("hero-container");
    const wrapper = document.getElementById("wrapper");
    if (!wrapper) return;
    if (!heroGrid) return;
    if (zoomIs > 1.02) {
      heroGrid.classList.remove("xl:flex-row");
    } else {
      heroGrid.classList.add("xl:flex-row");
    }
    // reduce padding as the size of the hero increases
    const padding = paddingValue() - zoomIs * 50;
    if (zoomIs === 1) wrapper.style.padding = `${paddingValue()}px`;
    else {
      if (isDesktop) {
        if (padding > 30) wrapper.style.padding = `${padding}px`;
        // adjust width of hero heading between 1 and 1.2 zoomIs
        const heading = document.querySelector("#hero-container  h1");
        if (heading)
          if (zoomIs > 1.05 && zoomIs < 1.2) {
            heading.style.width = `${(76 / 100) * 1200}px`;
          } else {
            heading.style.width = "100%";
          }
      }
    }

    // reduce hero image height as zoom increases
    const heroImage = document.getElementById("hero-images");
    if (heroImage)
      heroImage.style.height = `${((!isMobile ? 600 : 400) / 100) * (100 - zoomIs * 10)}px`;

    // change flex direction of button container when zoom is above 1
    const buttonContainer = document.getElementById("hero-buttons");
    if (buttonContainer) {
      if (!isMobile && !isDesktop) {
        // normal css: flex-col md:flex-row
        if (zoomIs > 1.5) {
          buttonContainer.classList.remove("md:flex-row");
        } else {
          buttonContainer.classList.add("md:flex-row");
        }
      } else {
        if (isDesktop) {
          if (zoomIs > 1.75) {
            buttonContainer.classList.remove("md:flex-row");
          } else {
            buttonContainer.classList.add("md:flex-row");
          }
        }
      }
    }

    // adjust hero button flex direction when zoom is above 1.5
    const heroBtn = document.getElementsByClassName("hero-button");
    if (heroBtn) {
      if (isMobile) {
        if (zoomIs > 1.5) {
          Array.from(heroBtn).forEach((btn) => {
            btn.classList.add("flex-col");
          });
        } else {
          Array.from(heroBtn).forEach((btn) => {
            btn.classList.remove("flex-col");
          });
        }
      }
    }
  };

  // throttle the zoom function to prevent too many calls
  const throttle = (func, ms) => {
    let inThrottle = false;

    return function (...args) {
      const context = this;

      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;

        setTimeout(() => {
          inThrottle = false;
        }, ms);
      } else {
        console.log("throttling");
      }
    };
  };

  const handleZoom = throttle((direction, rate, e) => {
    e.preventDefault();
    console.log("zooming");
    // move in if direction is 1, move out if direction is 0
    if (zoomFactor <= 1.0 && direction === 0) {
      return;
    }
    if (zoomFactor >= MAX_ZOOM && direction === 1) {
      return;
    }
    let newZoomFactor = zoomFactor + (direction === 1 ? rate : -rate);
    newZoomFactor = Math.max(newZoomFactor, rate);

    // const adjustedZoomFactor =
    // newZoomFactor >= 1 ? newZoomFactor ** 2 : newZoomFactor ** 0.5;
    setZoomFactor(newZoomFactor);
    const wrapper = document.getElementById("wrapper");
    wrapper.style.transform = `scale(${newZoomFactor})`;
    wrapper.style.width = `${100 / newZoomFactor}%`;
    handleHeroOnZoom();
  }, 100);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        handleZoom(e.deltaY < 0 ? 1 : 0, 0.02, e);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        setInitialDistance(calculateDistance(e.touches));
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        const currentDistance = calculateDistance(e.touches);
        handleZoom(currentDistance > initialDistance ? 1 : 0, 0.01, e);
        setInitialDistance(currentDistance);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [zoomFactor, initialDistance]);

  // set screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      resetOnResize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenWidth]);

  return (
    <div
      id="wrapper"
      className=" min-h-screen md:px-6 px-4 lg:px-[120px] py-20 flex items-start justify-center w-screen "
      style={{
        background: "var(--blue-green-gradient)",
      }}
    >
      <div className="fixed top-4 ">
        <p>Scroll/Pinch to zoom in/out</p>
        <p>current zoom: {zoomFactor}</p>
        <p>Min zoom allowed: 1.0</p>
        <p>Max zoom allowed: {MAX_ZOOM}</p>
      </div>
      <div
        id="hero-container"
        className="flex w-full justify-between max-w-[1200px] items-start flex-col xl:flex-row hero-grid "
      >
        {/* LEFT SIDE */}
        <div className="flex-1 gap-8 flex flex-col items-start ">
          <div className="flex flex-col items-start gap-6">
            {/* tag */}
            <div className="flex items-center gap-2 uppercase text-xs leading-3 font-bold  w-full md:w-fit px-2 md:px-4 py-2 rounded-[20px] bg-bg border border-bg-border">
              <img
                src="/icons/trophy.png"
                alt="trophy icons"
                className="w-4 h-4"
              />
              #1 email tracking service
            </div>
            {/* heading */}
            <h1 className="text-text">
              Find out <span className="text-primary">when</span> and{" "}
              <span className="text-accent">where</span> your emails are opened
            </h1>
            <p className="">
              Get instant receipts showing the location and number of times
              read, re-read, or forwarded for any emails you send
            </p>
          </div>
          <div className="flex flex-col items-start gap-6">
            <TopPoints />
            <HeroButtons />
          </div>
          <TrustComp />
        </div>
        {/* RIGHT SIDE */}
        <div className="flex-1 min-h-[357px] w-full">
          <HeroImages />
        </div>
      </div>
    </div>
  );
}

const HeroImages = () => {
  return (
    <div
      id="hero-images"
      className="relative grid w-full h-[400px] sm:h-[500px] md:h-[524px]"
    >
      <img
        src="/heroMap.png"
        alt="hero map"
        className=" w-[110%] sm:w-full absolute top-8"
      />
      <img
        src="/devices.png"
        alt="hero  devices"
        style={{
          aspectRatio: "403/279",
          objectFit: "contain",
        }}
        className="absolute w-[90%] md:w-[65%] justify-self-center bottom-0 mt-20  xl:-bottom-6  h-[279px] "
      />
    </div>
  );
};

const TopPoint = ({ label }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <img
          src="/icons/logoBullet.png"
          alt="check icon"
          style={{
            objectFit: "contain",
          }}
          className=" w-4 h-4"
        />
        <h3 className="text-primary"> {label}</h3>
      </div>
    </>
  );
};

const TopPoints = () => {
  const points = [
    {
      label: "25+ Years of Service Uptime",
    },
    {
      label: "1 M+ Users",
    },
    {
      label: "250M Tracked Emails ",
    },
  ];
  return (
    <div className="flex gap-x-6 gap-y-3 flex-wrap items-center">
      {points.map((point, index) => (
        <TopPoint key={index} {...point} />
      ))}
    </div>
  );
};

const HeroButtons = () => {
  return (
    <div
      id="hero-buttons"
      className="flex gap-6 w-full flex-col md:flex-row h-fit"
    >
      <PrimaryButton
        label="google workspace Addon"
        iconNm="buttonGoogle"
        bgColor="bg-primary"
        className={"w-full"}
        subIconsNm={"gmailbtn_icons"}
        subIconsText={"For Google Workspace and Gmail users"}
      />
      <PrimaryButton
        label="MIcrosoft Office Addon"
        className={"w-full"}
        iconNm="buttonMicroIcon"
        bgColor="bg-accent"
        subIconsNm={"hotmail_btn_icons"}
        subIconsText={"For Hotmail and Microsoft Outlook Users"}
      />
    </div>
  );
};

const PrimaryButton = ({
  label,
  iconNm,
  bgColor,
  className,
  subIconsNm,
  subIconsText,
}) => {
  return (
    <div className="flex items-start flex-col gap-2 w-full">
      <button
        className={`border text-center hero-button  border-primary-border ${bgColor} capitalize ${className}  `}
      >
        <img
          src={`/icons/${iconNm}.png`}
          alt="mircosoft workspace icon"
          className="w-6 h-6"
        />
        {label}
      </button>
      {subIconsNm && (
        <div className="flex items-center flex-row gap-1">
          <img
            src={`/icons/${subIconsNm}.png`}
            alt="arrow icon"
            className="w-fit h-4"
          />
          <p className="subtext">{subIconsText}</p>
        </div>
      )}
    </div>
  );
};

const TrustComp = () => {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <img src="/characters.png" alt="lock icon" className=" h-7" />
      <div className="flex flex-col items-start gap-1">
        <img src="/icons/small.png" alt="lock icon" className="h-4 w-fit" />
        <p className="text-text subtext !font-semibold">
          1 M + already track using ReadNotify
        </p>
        <p className="!text-primary subtext !font-semibold">
          Get started for free!
        </p>
      </div>
    </div>
  );
};
