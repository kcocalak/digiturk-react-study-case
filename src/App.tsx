import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import "./App.css";
import { Forecastday, Hour, Weather } from "./types";

function App() {
  const [waetherData, setWaetherData] = useState<Weather>();
  const [location] = useState("London"); 
  //celsius ve fahrenheit tiplerine gore dereceler degistigi icin kontrol olusturmak amaciyla temperature type eklendi
  const [tempType, setTempType] = useState('celsius')
  // anlik saatten sonraki saatteki bilgileri tutmak icin state olusturuldu 
  const [nextHours, setNextHours] = useState<Hour[]>([]) 
  
  const hour = moment().hour(); //anlik saat bilgisi

  // sayfa ilk render edildiginde istek atarak api'dan bilgileri cekiyor
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WAETHER_API_KEY}&q=${location}&days=1`;
  useEffect(() => {
    const getWaetherData = () => {axios.get(url).then((response) => {
      setWaetherData(response.data);
      response.data.forecast?.forecastday.map((i: Forecastday) => {
        let tempNextHours:Hour[] = []
        i.hour.map((item:Hour,index:number)=>{    
          //sonraki ilk 8 datayi cekmek icin kosul konuldu.  
          if(parseInt(item.time.split(' ')[1].split(':')[0]) > hour && index < (hour + 9)) {
            
            tempNextHours.push(item)
          } 
        });
        console.log(tempNextHours);
        
      setNextHours(tempNextHours)
      })
    });}
    getWaetherData()
    const interval = setInterval(() => getWaetherData(), 10000)
        return () => {
          clearInterval(interval);
        }

  }, []);

  return (
    <div className="container">
      <div className="top">
        <div className="wheather">
          <div className="condition">
            <span className="h2">{waetherData?.current?.condition.text}</span>
          </div>
          <div className="temperature-type">
            {tempType === "celsius" ? (
              <span
                onClick={() => setTempType("celsius")}
                className="h3-active"
              >
                °C
              </span>
            ) : (
              <span onClick={() => setTempType("celsius")} className="h3">
                °C
              </span>
            )}

            {tempType === "fahrenheit" ? (
              <span
                onClick={() => setTempType("fahrenheit")}
                className="h3-active"
              >
                °F
              </span>
            ) : (
              <span onClick={() => setTempType("fahrenheit")} className="h3">
                °F
              </span>
            )}
          </div>
        </div>
        <div className="location">
          <span>
            {waetherData?.location?.name}, {waetherData?.location?.country}
          </span>
        </div>
      </div>
      <div className="body" style={{ marginBottom: 20 }}>
        {nextHours.map((item: Hour, index: number) => {
          //ilk verinin daha buyuk gosterilmesi icin if condion olusturuldu.
          if (index === 0 && item) {
            return (
              <div style={{ marginRight: 28 }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{ fontWeight: "bold" }}>
                    {moment(item.time).format("HH A")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span>
                    <img src={item.condition.icon} style={{ width: "100%" }} />
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span className="h1">
                    {tempType === "celsius" ? item.temp_c : item.temp_f}°
                  </span>
                </div>
              </div>
            );
          } else {
            return (
              <div style={{ marginTop: 10, marginRight: 28 }}>
                <div className="content-center">
                  <span style={{ color: "#7F8487" }}>
                    {moment(item.time).format("HH A")}
                  </span>
                </div>
                <div className="content-center">
                  <span>
                    <img src={item.condition.icon} style={{ width: "100%" }} />
                  </span>
                </div>
                <div className="content-center">
                  <span style={{ fontSize: 20 }}>
                    {tempType === "celsius" ? item.temp_c : item.temp_f}°
                  </span>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default App;
