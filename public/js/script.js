const socket = io();

if(navigator.geolocation)
{
    navigator.geolocation.watchPosition((possition) => {
           const { latitude ,longitude} = possition.coords;
           socket.emit("send-location" , {latitude , longitude});
    },(error) => {
        console.log(error , "while getting location");
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
}

const map = L.map("map").setView([0, 0], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Open map"
}).addTo(map);

const marker = {};

socket.on("recive-location" , function(data){
    const {id , latitude , longitude} = data;   
    map.setView([latitude , longitude] , 15);
    if(marker[id])
    {
        marker[id].setLatLng([latitude , longitude]);
    }
    else{
        marker[id] = L.marker([latitude , longitude]).addTo(map);
    }
});

socket.on("user-disconnected" , (id)=>{
    if(marker[id])
    {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});