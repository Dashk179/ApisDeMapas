
let infoWindow,Marcador,Dialogos;


function initMap() {
    
   map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 3,
    
    //Opcion de relieve y mapa con  opcion despegable 
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: ["roadmap", "terrain"],
    },
    
  });

  //Boton para geolocalizacion
infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Llevame a donde vives";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Tù te encuentras en este sitio.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);

}

renderData()

async function getData(){
    const response = await fetch('https://master-covid-19-api-laeyoung.endpoint.ainize.ai/jhu-edu/latest')
    const data = await response.json();
    return data
}

function renderExtraData({confirmed,deaths,recovered,provincestate,countryregion}){
    return `
    <div>
        <p> <strong> ${provincestate} - ${countryregion}</strong></p>
        <p>Confirmados : ${confirmed}</p>
        <p>Muertes:  ${deaths}</p>
        <p>Recuperados: ${recovered}</p>
    </div>
    `
}

  async function renderData(){
      const data = await getData()
      console.log(data)

      data.forEach(item => {
      const Marcador =  new window.google.maps.Marker({
            position: {
                lat:item.location.lat,
                lng:item.location.lng,
                
            },
            map,
           icon: '\covidnueva.png'
        
        })
        Dialogos = new window.google.maps.InfoWindow()

        Marcador.addListener('click',()=>{
        Dialogos.setContent(renderExtraData(item))
        Dialogos.open(map,Marcador)
    })
    })
    
}

  
