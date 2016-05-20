//DEFINE VARIABLES
var url = "http://128.40.150.34:8896/data/cities";
var dataArray = [];
var markerArray = [];
var pointsArray = [];
var circleArray = [];
var countriesArray = [];
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

//EVENT CLICK FOR 1ST MAP
$("#Map01").click( function(event){
			event.preventDefault();
            markerCluster.clearMarkers();
            setAllMap(null);
            clearCircles(null);
			google.maps.event.clearListeners(map, 'dragend');
			//Clear Markers
			// --------- Call your edited getCameraData changed to getMapData() function in here --------------
			getMapAll(); 
            destroySlider();
		});

//EVENT CLICK FOR 2ND  MAP
$("#Map02").click( function(event){
            markerCluster.clearMarkers();
            event.preventDefault();
			//Clear Markers
            clearCircles(null);
            setAllMap(null);
			google.maps.event.clearListeners(map, 'dragend');

			//Clear Markers
			// --------- Call your edited getCameraData changed to getMapData() function in here --------------
            getSlider();
		});


//EVENT CLICK FOR 3ND  MAP
$("#Map03").click( function(event){
            event.preventDefault();
			//Clear Markers
            clearCircles(null);
            setAllMap(null);
			google.maps.event.clearListeners(map, 'dragend');

			//Clear Markers
			// --------- Call your edited getCameraData changed to getMapData() function in here --------------
			destroySlider();
            getSliderCor();
		});

//CREATE SLIDER FOR MAP 2
function getSlider(){
$("#slider").slider(
{ 
        min: 1960, 
        max: 2005, 
        step: 1,
        slide : function(event, ui) {
            $("#boxAno").val(ui.value);
            getMapData(ui.value);
            getChart(ui.value);
        },
    });
 /*  $("#boxAno").val($("#slider").slider("value")); */    
}

//CREATE SLIDER FOR MAP 3
function getSliderCor(){
$("#slider").slider(
{ 
        min: 1960, 
        max: 2005, 
        step: 1,
        slide : function(event, ui) {
            $("#boxAno").val(ui.value);
            getMapCor(ui.value);
        },
    });
 /*  $("#boxAno").val($("#slider").slider("value")); */    
}

//DESTROY THE SLIDER
function destroySlider(){
$( "#slider").slider( "destroy" );
}




//Set map style
 var styles = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];

//draw the Main Map
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

// Get All events data and draw:  
function getMapAll() {
    //set variables and clear previous data
    var infowindow = new google.maps.InfoWindow({    
                       maxWidth: 200});     
    markerCluster.clearMarkers();
    clearCircles(null)
    setAllMap(null);
    circleArray = [];
    //get json and create circles
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
                    
                    //create infowindow
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
                    
//Draw Events type by Year Map
function getMapData(year){  
    //variables and cleaning
    var infowindow = new google.maps.InfoWindow({    
    maxWidth: 200,
    height: 200 });  
            markerCluster.clearMarkers();
            setAllMap(null);
            clearCircles(null);
			markerArray = [];
			var url2 = "http://128.40.150.34:8896/data/year/"+year;
            var url3 = "http://viewer.phildow.net/world-gdp-growth/world-countries.json"
			console.log(url2);
			console.log("Started ...");
            
            //get json 
			$.getJSON( url2, function( data ) {
				$.each(data, function(k,v){
					
                    //prevent overlapping markers and draw
                    var coordinates_hash = new Array();
                    var coordinates_str, actual_lat, actual_lon, adjusted_lat, adjusted_lon;
                            actual_lat  = this.lat
                            actual_lon = this.lon;
                            coordinates_str = actual_lat + actual_lon;
                            adjusted_lat = parseFloat(actual_lat) ;
                            adjusted_lon = parseFloat(actual_lon)+ (Math.random()-.5)/5;

                    var myLatLng = new google.maps.LatLng(adjusted_lat, adjusted_lon);
			
					pointsArray.push(myLatLng);                                                                         					
					var marker = new google.maps.Marker({
      					position: myLatLng, 
      					icon: "./img/"+v.Problem_Type+".png"			
      				});
                    
                    //infowindow
                    var content = "<b>City: </b>"+v.City+"<br/><b>Country:</b>"+v.Country+" <br/><b>Main Actor: </b> "+v.Actor1+"<br/><b>Main Target: </b>"+v.Target1+"<br/><b>Comment: </b>"+v.COMMENT;
                    var iPosition = myLatLng;
                    
                     marker.addListener('click', function() {
                            infowindow.setContent('<div id = "infoW">'+content+'</div>'); 
                            infowindow.setPosition(iPosition);
						    infowindow.open(map,marker);     
						});
                    markerArray.push(marker);
                });
                setAllMap(map);
            });
    }

//Draw all Events related to GDP
function getMapCor(year){  
    //variables and cleaning
    var infowindow = new google.maps.InfoWindow({    
    maxWidth: 200,
    height: 200 });
    
        map.data.forEach(function(feature) {
        map.data.remove(feature);
        });

            markerCluster.clearMarkers();
            setAllMap(null);
            clearCircles(null);
			markerArray = [];
            countriesArray = [];
			var url2 = "http://128.40.150.34:8896/data/year/"+year;
			console.log(url2);
			console.log("Started ...");
 
                            
            //get json for points
			$.getJSON( url2, function( data ) {
				$.each(data, function(k,v){
					
                    var latLng = new google.maps.LatLng(v.lat, v.lon);
					
					pointsArray.push(latLng);                                                                         					
					var marker = new google.maps.Marker({
      					position: latLng, 
      					icon: "./img/icon.png"			
      				});
                     var content = "<b>City: </b>"+v.City+"<br/><b>Country:</b>"+v.Country+" <br/><b>Main Actor: </b> "+v.Actor1+"<br/><b>Main Target: </b>"+v.Target1+"<br/><b>Comment: </b>"+v.COMMENT;
                    var iPosition = latLng;
                    
                     marker.addListener('click', function() {
                            infowindow.setContent('<div id = "infoW">'+content+'</div>'); 
                            infowindow.setPosition(iPosition);
						    infowindow.open(map,marker);
                         
						});
                    markerArray.push(marker);
                 
                });
               
                var urlG = "https://raw.githubusercontent.com/gabrielauchoa/socialDisruptionwebsite/master/docs/"+year+".geojson"
                map.data.loadGeoJson(urlG);
                map.data.setStyle(function(feature){
                    var opacity = feature.getProperty(year+'_gdpcapppp');
                                return{ 
                                    fillColor: 'red',
                                    fillOpacity: opacity/5000,
                                    strokeWeight: 0.1
                                    }
                                });
                 
                var mcOptions = {gridSize: 10, maxZoom: 20, styles: clusterStyles,}; 
                markerCluster = new MarkerClusterer(map, [], mcOptions);
                markerCluster.addMarkers(markerArray, true); 
          
        });
                
             setAllMap(map);               
                              
}
                                
                                  
                                           
                                  
//Create Charts 

google.charts.load('current', {'packages':['sankey','controls','bar','corechart']});
google.charts.setOnLoadCallback(drawSD);


function getChart(year){
     function drawChart(){
        
        var pt01 = "General Warfare", pt02 = "Inter-communal Warfare", pt03 = "Armed Battle/Clash", pt04 = "Armed Attack", pt05 = "Pro-Government Terrorism (Repression)", pt06 = "Anti-Government Terrorism", pt07 = "Communal Terrorism", pt08 = "Organized Violent Riot", pt09 = "Spontaneous Violent Riot", pt10 = "Organized Demonstration", pt11 = "Pro-Government Demonstration",
            pt12 = "Spontaneous Demonstration";
         
        $.ajax({
          url: "http://128.40.150.34:8896/data/type/"+year,
          dataType: "JSON"
        }).done(function(data) {
                var typeArray = [["Year",pt01,pt02,pt03,pt04,pt05,pt06,pt07,pt08,pt09,pt10,pt11,pt12]];
                $.each(data, function() {
                    
                    var typeitem = [year, this[pt01],this[pt02],this[pt03],this[pt04],this[pt05],this[pt06],this[pt07],this[pt08],this[pt09],this[pt10],this[pt11],this[pt12]];
                   typeArray.push(typeitem); 
                });
                  
          console.log(typeArray);
            var typeData = google.visualization.arrayToDataTable(typeArray);
            var chart = new google.visualization.BarChart(document.getElementById('chart'));
            var options = {
                isStacked: true,
                backgroundColor: 'transparent',
                height: 100,
                bar:{groupWidth:20},
                legend: {position: 'bottom', maxLines: 3, textStyle: {color: 'white', fontSize: 8}},
                hAxis: {baselineColor: "white", minValue: 0, maxValue:110,textStyle: {color: 'white', fontSize: 7},textPosition: 'in'},
                vAxis: {gridlines: {color:'transparent', count:2}, textStyle: {color: 'white', fontSize: 1},
                       textPosition: 'in' },
                series: {
                    0:{color:'red'},
                    1:{color:'#FCDEF7'},
                    2:{color:'#611C1C'},
                    3:{color:'#B52681'},
                    4:{color:'#753D2B'},
                    5:{color:'#71498C'},
                    6:{color:'#49528C'},
                    7:{color:'#49718C'},
                    8:{color:'#49898C'},
                    9:{color:'#6C8C49'},
                    10:{color:'#BF7777'},
                    11:{color:'#FFFAB8'}
  }

                
        };
          chart.draw(typeData,options);
        });  
     }
    google.charts.setOnLoadCallback(drawChart);
}




//function to create sankey diagram
function drawSD() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Actor');
        data.addColumn('string', 'Target');
        data.addColumn('number', 'Events');
        data.addRows([
          [ 'Union', 'Domestic Government', 5 ],
          [ 'Union', 'Army', 7 ],
          [ 'Religious', 'Domestic Government', 6 ],
          [ 'Religious', 'Foreign Government', 2 ],
          [ 'Students', 'Domestic Government', 9 ],
          [ 'Students', 'Army', 4 ]
        ]);

        // Sets chart options.
          var colors = ['#e60000', '#cc0000', '#990000', '#660000',
                  '#ff8080', '#993333', '#1f78b4', '#33a02c'];

          var options = {
              height: 400,
              sankey: {
                  node: {
                    colors: colors
                        },
                  link: {
                      colorMode: 'gradient',
                      colors: colors
                  }
              }
          };
        // Instantiates and draws our chart, passing in some options.
        var chart = new google.visualization.Sankey(document.getElementById('sankey'));
        chart.draw(data, options);
      }




//cleaning functions
  
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

	
     
   




