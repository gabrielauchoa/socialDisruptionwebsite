//DEFINE GLOBAL VARIABLES
var url = "http://128.40.150.34:8896/data/cities";
var dataArray = [];
var markerArray = [];
var pointsArray = [];
var circleArray = [];
var map;
var year;
var marker;
var markerCluster;

var clusterStyles = [{
    textColor: 'white',
    url: 'https://raw.githubusercontent.com/gabrielauchoa/socialDisruptionwebsite/master/gcluster.png',
    height: 30,
    width: 30
  }];

//console.log($.ui);


//DEFINE CLICK FUNCTIONS:

//ALL EVENTS MAP
$("#Map01").click( function(event){
			event.preventDefault();
            markerCluster.clearMarkers();
            setAllMap(null);
            clearCircles(null);
			google.maps.event.clearListeners(map, 'dragend');
			//insert map data:
			getMapAll(); 
            destroySlider();
		});

//EVENTS BY YEAR;
$("#Map02").click( function(event){
            event.preventDefault();
			//Clear Markers
            clearCircles(null);
            setAllMap(null);
			google.maps.event.clearListeners(map, 'dragend');
            getSlider();
            getMapData();
		});



function getSlider(){
$("#slider").slider(
{ 
        min: 1960, 
        max: 2005, 
        step: 1,
        slide : function(event, ui) {
            $("#boxAno").val(ui.value);
            getMapData(ui.value);
        },
       /* change: function(event, ui) {
            $("#boxAno").val(ui.value);
             getMapData(ui.value);
        }*/
    });
    
  /*  $("#boxAno").val($("#slider").slider("value")); */

    
}

function destroySlider(){
$( "#slider").slider( "destroy" );
}





 var styles = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];
        
 function initMap() {
  // Create the map.
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 12.895698, lng: 53.173977},
    mapTypeId: google.maps.MapTypeId.ROAD
  });
            
            map.set('styles', styles);
            var mcOptions = {gridSize: 10, maxZoom: 20, styles: clusterStyles,}; 
            markerCluster = new MarkerClusterer(map, [], mcOptions);
 }

     
  function getMapAll() {
      var infowindow = new google.maps.InfoWindow({    
      maxWidth: 200});     
      clearCircles(null);
      setAllMap(null);
      circleArray = [];
      markerCluster.clearMarkers();

    $.getJSON(url, function( data ) {
				$.each(data, function(k,v){
					
					var latLng = new google.maps.LatLng(v.lat, v.lng);
					dataArray.push(latLng);
					
					var cityCircle = new google.maps.Circle({
      					strokeColor: '#FF0000',
                        strokeOpacity: 0.1,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35,
                        map: map,
                        center: latLng,
                        radius: Math.sqrt(v.events) * 35000			
      				}); 
                    
                    var content = "<b>City: </b>"+v.City+"<br/><b>Country:</b>"+v.Country+" <br/><b>Population: </b> "+v.pop+"<br/><b>Number of Events: </b>"+v.events;
                    var iPosition = latLng;
                    
                     cityCircle.addListener('click', function() {
                            infowindow.setContent('<div id = "infoW">'+content+'</div>'); 
                            infowindow.setPosition(iPosition);
						    infowindow.open(map,cityCircle);
                         
						}); 
                    
                    circleArray.push(cityCircle);  
                });
        clearCircles(map);
        
    });
  }
                    




function getMapData(year){
      
    var infowindow = new google.maps.InfoWindow({    
    maxWidth: 200,
    height: 200 });  
    
			console.log("Getting Data: " + year);
            setAllMap(null);
            clearCircles(null);
            markerCluster.clearMarkers();
			markerArray = [];
    
			var url2 = "http://128.40.150.34:8896/data/year/"+year;
			console.log(url2);
			console.log("Started ...");

			$.getJSON( url2, function( data ) {
				$.each(data, function(k,v){
					
					/*var LatLng = new google.maps.LatLng(v.lat, v.lon);*/
                    
                    var coordinates_hash = new Array();
                    var coordinates_str, actual_lat, actual_lon, adjusted_lat, adjusted_lon;
                            actual_lat  = this.lat
                            actual_lon = this.lon;
                            coordinates_str = actual_lat + actual_lon;
                      //  while (coordinates_hash[coordinates_str] != null) {
                            // adjust coord by 50m or so
                            adjusted_lat = parseFloat(actual_lat) + (Math.random()-.5)/1000;
                            adjusted_lon = parseFloat(actual_lon) + (Math.random()-.5)/1000;
                          //  coordinates_str = String(adjusted_lat) + String(adjusted_lon);
                            //}
                    //    coordinates_hash[coordinates_str] = 1;

                    var myLatLng = new google.maps.LatLng(adjusted_lat, adjusted_lon);
			
					pointsArray.push(myLatLng);                                                                         					
					var marker = new google.maps.Marker({
      					position: myLatLng, 
      					icon: "./img/icon.png"			
      				});
                     var content = "<b>City: </b>"+v.City+"<br/><b>Country:</b>"+v.Country+" <br/><b>Main Actor: </b> "+v.Actor1+"<br/><b>Main Target: </b>"+v.Target1+"<br/><b>Comment: </b>"+v.COMMENT;
                     var iPosition = myLatLng;
                    
                     marker.addListener('click', function() {
                            infowindow.setContent('<div id = "infoW">'+content+'</div>'); 
                            infowindow.setPosition(iPosition);
						    infowindow.open(map,marker);
                         
						});
                  markerArray.push(marker); 
                });
                var mcOptions = {gridSize: 10, maxZoom: 20, styles: clusterStyles,}; 
                markerCluster = new MarkerClusterer(map, [], mcOptions);
                markerCluster.addMarkers(markerArray, true); 
            });
                setAllMap(map);
                //markerCluster.redraw();
    }

  
	function setAllMap(map) {
		for (var i = 0; i < markerArray.length; i++) {
			markerArray[i].setMap(map);
		}
        
	}
    function clearCircles(map) {
        for (var i = 0; i < circleArray.length; i++) {
			circleArray[i].setMap(map);
		}
	}
  
   




