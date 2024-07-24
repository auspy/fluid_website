import { useState, useEffect } from "react";
import "./FluidDesignMastery.css";

const FluidDesignMastery = () => {
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [initialDistance, setInitialDistance] = useState(null);

  const calculateDistance = (touches) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleZoom = (direction, rate, e) => {
    e.preventDefault();

    let newZoomFactor = zoomFactor + (direction === "in" ? rate : -rate);
    newZoomFactor = Math.max(newZoomFactor, rate);

    const adjustedZoomFactor =
      newZoomFactor >= 1 ? newZoomFactor ** 2 : newZoomFactor ** 0.5;

    setZoomFactor(newZoomFactor);
    const wrapper = document.getElementById("wrapper");
    wrapper.style.transform = `scale(${adjustedZoomFactor})`;
    wrapper.style.width = `${100 / adjustedZoomFactor}%`;
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        handleZoom(e.deltaY < 0 ? "in" : "out", 0.01, e);
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
        handleZoom(currentDistance > initialDistance ? "in" : "out", 0.01, e);
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

  return (
    <div id="wrapper">
      <header>
        <div className="header-bg"></div>
      </header>
      <main className="content-grid">
        <article>
          <h1>Fluid Design Principles</h1>
          <h3>Responsive and Adaptive Design Techniques</h3>
          <h2>Optimized for Modern Browsers</h2>
          <p>
            Zoom Level: <span>{zoomFactor.toFixed(2)}</span>
          </p>
          <p>
            Fluid design ensures your content scales smoothly without causing
            unwanted scrolling. Embrace the viewport meta tag to control layout
            on mobile devices effectively.
          </p>
        </article>
        <article>
          <p>
            In the realm of web development, the viewport meta tag is pivotal in
            crafting responsive designs. It adjusts content rendering on mobile
            devices, providing a seamless user experience across various screen
            sizes. This tag is a cornerstone for fluid design, ensuring that
            websites are accessible and functional on smartphones, tablets, and
            desktops without requiring users to zoom or scroll excessively. By
            setting the viewport width to the device width and scaling the
            initial zoom, developers can create more user-friendly and visually
            appealing web pages.
          </p>
        </article>
        <article>
          <p>
            Fluid design principles advocate for content that adjusts gracefully
            to different screen sizes. This avoids horizontal scrolling and
            enhances readability, crucial for an optimal user experience. By
            leveraging relative units like percentages and ems, developers can
            create layouts that flexibly adapt to the viewing environment,
            making content more engaging and easier to consume. This approach
            not only improves usability but also ensures that web pages look
            great on any device, from the smallest phone to the largest desktop
            monitor.
          </p>
        </article>
        <article>
          <p>
            Implementing fluid design involves strategic use of CSS properties
            and JavaScript. It requires understanding how elements behave on
            different devices and ensuring consistent presentation. Techniques
            such as media queries, responsive images, and viewport units are
            essential tools in a developer’s toolkit, allowing for a more
            dynamic and interactive user experience. By combining these
            techniques with a thorough testing process, developers can ensure
            their websites remain functional and visually appealing across a
            wide range of devices.
          </p>
        </article>
        <article>
          <p>
            Embracing a mobile-first approach is essential in fluid design. By
            prioritizing smaller screens, developers ensure a smooth transition
            to larger displays, enhancing accessibility and user experience.
            This approach forces a focus on the most important content and
            functionality, which can then be progressively enhanced for larger
            screens with additional features and layout changes. This method
            also helps in optimizing performance, as it encourages the use of
            lightweight resources that are beneficial for mobile users.
          </p>
        </article>
        <article>
          <p>
            Media queries play a critical role in fluid design. They enable
            responsive adjustments, such as layout changes, font size
            modifications, and image scaling, based on the device's
            characteristics. By applying different styles at various
            breakpoints, developers can create a seamless experience that feels
            natural on any device, from a small smartphone to a large desktop
            monitor. Media queries allow developers to tailor the design to the
            specific needs of each device, ensuring that users have the best
            possible experience regardless of how they access the website.
          </p>
        </article>
        <article className="wide-article">
          <p>
            Flexible grids and layouts are fundamental to fluid design. Using
            relative units like percentages instead of fixed units allows
            elements to resize dynamically, maintaining harmony across different
            screen sizes. Grid systems such as CSS Grid and Flexbox provide
            powerful tools to create adaptable and responsive layouts that
            maintain their structure and visual integrity on any device. These
            tools enable developers to create complex layouts that automatically
            adjust to the screen size, ensuring a consistent and polished
            appearance.
          </p>
        </article>
        <article>
          <p>
            Fluid typography ensures that text scales smoothly across devices,
            enhancing readability without overwhelming users. By utilizing
            relative units such as rems and ems for font sizes, developers can
            create a more consistent and accessible reading experience that
            adjusts seamlessly to the user’s preferred device and settings. This
            approach helps maintain a uniform look and feel, making the text
            easy to read whether it is viewed on a small mobile screen or a
            large desktop monitor.
          </p>
        </article>
        <article>
          <p>
            Responsive images are a key aspect of fluid design, ensuring that
            visuals load quickly and look sharp on all devices. Techniques like
            the srcset attribute and the picture element allow developers to
            serve appropriately sized images based on the user’s device,
            reducing load times and improving overall performance. This ensures
            that users always see high-quality images that are optimized for
            their specific device, enhancing the overall visual experience
            without sacrificing performance.
          </p>
        </article>
        <article>
          <p>
            Accessibility is a crucial consideration in fluid design. Ensuring
            that web content is usable by people with disabilities involves
            creating adaptable layouts, providing alternative text for images,
            and ensuring that interactive elements are keyboard-navigable. This
            not only enhances the user experience but also ensures compliance
            with legal standards and best practices. By making websites more
            accessible, developers can reach a broader audience and provide a
            better user experience for everyone.
          </p>
        </article>
        <article>
          <p>
            Performance optimization is vital in fluid design. Efficient use of
            CSS, JavaScript, and media assets ensures that websites load quickly
            and run smoothly on all devices. Techniques such as lazy loading,
            minimizing HTTP requests, and leveraging browser caching can
            significantly enhance the user experience by reducing load times and
            improving responsiveness. These optimizations help ensure that users
            can access content quickly and easily, regardless of their device or
            internet connection.
          </p>
        </article>
        <article>
          <p>
            Continuous testing and iteration are essential for maintaining a
            fluid design. Regularly testing websites on various devices and
            screen sizes helps identify and address any issues that may arise,
            ensuring a consistently high-quality user experience. Utilizing
            tools like responsive design mode in browsers and online testing
            platforms can streamline this process, making it easier to detect
            and fix problems early. This ongoing process of testing and
            refinement helps ensure that websites remain functional, accessible,
            and visually appealing across all devices.
          </p>
        </article>

        {/* Add more articles as needed */}
      </main>
    </div>
  );
};

export default FluidDesignMastery;
