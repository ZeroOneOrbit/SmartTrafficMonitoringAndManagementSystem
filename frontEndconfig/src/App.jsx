import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const App = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    // Longitude, Latitude
    const center = [90.4900, 23.6183];

    // Create the map
    const map = new maplibregl.Map({
      container: mapContainer.current,

      // OpenFreeMap Dark Theme
      style: "https://tiles.openfreemap.org/styles/dark",

      center: center,

      zoom: 17,
    });

    // Add zoom controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Wait until the map loads
    map.on("load", () => {
      // Add a red marker
      new maplibregl.Marker({
        color: "red",
      })
        .setLngLat(center)
        .setPopup(
          new maplibregl.Popup().setHTML(`
            <h3>My Location</h3>
            <p>Longitude: ${center[0]}</p>
            <p>Latitude: ${center[1]}</p>
          `)
        )
        .addTo(map);
    });

    // Cleanup
    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default App;