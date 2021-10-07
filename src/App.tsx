import { FC, useState } from "react";
import "./App.css";
import GoogleMapReact from "google-map-react";

const App: FC = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getCoordinates,
        handleLocationError
      );
    } else alert("Geolocation is not supported by this browser");
  };

  const getCoordinates = async (position: any) => {
    setLongitude(position?.coords?.longitude);
    setLatitude(position?.coords?.latitude);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position?.coords?.latitude},${position?.coords?.longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAddress(data["results"][0]["formatted_address"]);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  const handleLocationError = (error: any) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
      default:
        alert("An unknown error occurred.");
    }
  };

  const Location: React.FC<any> = ({ text }) => (
    <div className="location-details">{text}</div>
  );

  const defaultProps = {
    center: {
      lat: 7.80232,
      lng: 2.733343,
    },
    zoom: 2,
  };

  return (
    <div className="App">
      <div className="google-map">
        <button onClick={getLocation}>
          {loading ? "...loading" : "Find me"}
        </button>
        <GoogleMapReact
          bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_API_KEY}` }}
          defaultCenter={defaultProps.center}
          center={{
            lat: latitude ? Number.parseInt(latitude) : defaultProps.center.lat,
            lng: longitude
              ? Number.parseInt(longitude)
              : defaultProps.center.lng,
          }}
          zoom={8}
          defaultZoom={defaultProps.zoom}
        >
          {longitude && latitude && (
            <Location
              lat={`${latitude}`}
              lng={`${longitude}`}
              text={`${address}`}
            />
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default App;
