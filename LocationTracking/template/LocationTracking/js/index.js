var beacons = new Array();
var placedBeacons =  new Array();
var mapDimensions;
var scale;


function getDimensions(id)
{
	var i = document.getElementById(id);
	var dims = new Object();
	dims[0] = i.offsetWidth;
	dims[1] = i.offsetHeight;
	return dims;
}

function hideAllAreas()
{
	$(".area").css({visibility: 'hidden'});
}

function placeArea(minor, radius)
{
	var b = placedBeacons[minor];
	var scaledX = b.x * scale;
        var scaledY = (mapDimensions[1] - (b.y * scale));
        var scaledZ = b.y * scale;
	
	var newX = scaledX - (radius * scale);
        var newY = scaledY - (radius * scale);

	var area = $("#area"+minor);
	area.width(radius * 2 * scale);
	area.css({left: newX, top: newY, visibility: 'visible'});
}

function placeBeacons()
{
	var beaconList = document.querySelectorAll(".beacon");
	mapDimensions = getDimensions("map_container");
	scale = (mapDimensions[0] / (27.1 * 54.9));
	var beaconWidth = beaconList[0].offsetWidth;
	var beaconHeight = beaconList[0].offsetHeight;

	for(var i=0; i<beaconList.length; i++)
	{
		var beacon = beaconList[i];
		var actualX = beacon.getAttribute("x");
		var actualY = beacon.getAttribute("y");
		var actualZ = beacon.getAttribute("z");
		var minor = beacon.getAttribute("minor");

		var scaledX = actualX * scale;
		var scaledY = (mapDimensions[1] - (actualY * scale));
		var scaledZ = actualZ * scale;

		var newX = scaledX - (beaconWidth/2);
		var newY = scaledY - (beaconHeight/2);

		beacon.style.left = newX + "px";
		beacon.style.top = newY + "px";
		beacon.style.visibility = "visible";

		var b = new Object();
		b.x = parseFloat(actualX);
		b.y = parseFloat(actualY);
		b.z = parseFloat(actualZ);
		b.minor = minor;		

		placedBeacons[minor] = b;
	}
	window.setInterval("getCurrentPosition()", 2000);
}

function Point(x,y)
{
	var p = new Object();
	p.x = x;
	p.y = y;
	return p;
}

function distance(a,b)
{
	return Math.sqrt(sqr(a.x - b.x) + sqr(a.y - b.y));
}

function trilateration()
{
	var devicePoint;
	var i;
	var j;

	var p1 = new Object();
	var p2 = new Object();
	var p3 = new Object();

	var beacon1 = new Object();
	var beacon2 = new Object();
	var beacon3 = new Object();

	var point1, point2, point3, point4, point5, point6;
	
	hideAllAreas();

	for (var i=0; i<3; i++)
	{
		placeArea(beacons[i].minor,beacons[i].distance);
	}

	return 0;
	if(beacons.length > 2)
	{
		beacon1 = beacons[0];
		beacon1.x = placedBeacons[beacon1.minor].x;
		beacon1.y = placedBeacons[beacon1.minor].y;

		for (i = 1; i< beacons.length; i++)
		{
			beacon2 = beacons[i];
                	beacon2.x = placedBeacons[beacon2.minor].x;
                	beacon2.y = placedBeacons[beacon2.minor].y;

			var points1 = intersection(beacon1.x, beacon1.y, beacon1.distance, beacon2.x, beacon2.y, beacon2.distance);
			
			if(points1 != false)
			{
				point1 = Point(points1[0],points1[1]);
				point2 = Point(points1[2],points1[3]);
				break;
			}
		}
		if(i < beacons.length)
		{
			for (j = i+1; j< beacons.length; j++)
			{
				beacon3 = beacons[j];
                        	beacon3.x = placedBeacons[beacon3.minor].x;
                        	beacon3.y = placedBeacons[beacon3.minor].y;

				var points2 = intersection(beacon1.x, beacon1.y, beacon1.distance, beacon3.x, beacon3.y, beacon3.distance);
				var points3 = intersection(beacon2.x, beacon2.y, beacon2.distance, beacon3.x, beacon3.y, beacon3.distance);


					console.log(beacon1);					
					console.log(beacon2);					
					console.log(beacon3);					

				if(points2 != false && points3 != false)
                        	{
                                	point3 = Point(points2[0],points2[1]);
                                	point4 = Point(points2[2],points2[3]);
                                	
					point5 = Point(points3[0],points3[1]);
                                	point6 = Point(points3[2],points3[3]);
					
                                	break;
                        	}

			}
			if(j < beacons.length)
			{
				
				console.log('In range of three 1');
				var p = [point1, point2, point3, point4, point5, point6];
				var min = 10000000;
				for (var i = 0; i < p.length - 2; i++) {
        				for (var j = i + 1; j < p.length - 1; j++) {
            					for (var k = j + 1; k < p.length; k++) {
                					var perimeter = distance(p[i], p[j]) + distance(p[j], p[k]) + distance(p[k], p[i]);
							if(perimeter < min)
							{
								console.log('In range of three');
								min = perimeter;
								devicePoint = center_of_three(p[i], p[j], p[k]);
								placeArea(beacon1.minor,beacon1.distance);
								placeArea(beacon2.minor,beacon2.distance);
								placeArea(beacon3.minor,beacon3.distance);
							}
            					}
        				}
    				}
			}
			else
			{
				console.log('In range of two');
				devicePoint = center_of_two(point1, point2);
				placeArea(beacon1.minor,beacon1.distance);
				placeArea(beacon2.minor,beacon2.distance);
			}
		}
		else
		{
			console.log('In range of one');
			beacon2 = beacons[1];
                        beacon2.x = placedBeacons[beacon2.minor].x;
                        beacon2.y = placedBeacons[beacon2.minor].y;

			beacon3 = beacons[2];
                        beacon3.x = placedBeacons[beacon3.minor].x;
                        beacon3.y = placedBeacons[beacon3.minor].y;

			devicePoint = center_of_three(Point(beacon1.x, beacon1.y),Point(beacon2.x, beacon2.y),Point(beacon3.x, beacon3.y));
			placeArea(beacon1.minor,beacon1.distance);
			placeArea(beacon2.minor,beacon2.distance);
			placeArea(beacon3.minor,beacon3.distance);
		}
			
		placeDevice(devicePoint);
	}
}

function placeDevice(center)
{
	var device = $('#device');
	var scaledX = center.x * scale;
	var scaledY = (mapDimensions[1] - (center.y * scale));
	var newX = scaledX - (device.width()/2.0);
	var newY = scaledY - (device.height()/2.0);
	device.css({left: newX, top: newY, visibility:'visible'});
}

function getCurrentPosition()
{
	$.ajax({
    		url: "/get_current_position",
    		success: function(data) {
			var parsedData = JSON.parse(data);
			beacons = new Array();
			for ( var d in parsedData)
			{
				if(parsedData[d].fields.minor <= 12)
				{
					var beacon = new Object();
					beacon.minor = parsedData[d].fields.minor;
					beacon.major = parsedData[d].fields.major;
					beacon.mac = parsedData[d].fields.mac;
					beacon.distance = (parsedData[d].fields.distance)*39.3701;
					beacon.rssi = parsedData[d].fields.rssi;
					beacons.push(beacon);
				}
			}
			trilateration()
    		}
	});
	
}

function intersection(x0, y0, r0, x1, y1, r1) {
	var a, dx, dy, d, h, rx, ry;
        var x2, y2;

        /* dx and dy are the vertical and horizontal distances between
         * the circle centers.
         */
        dx = x1 - x0;
        dy = y1 - y0;

        /* Determine the straight-line distance between the centers. */
        d = Math.sqrt((dy*dy) + (dx*dx));

        /* Check for solvability. */
        if (d > (r0 + r1)) {
            /* no solution. circles do not intersect. */
            return false;
        }
        if (d < Math.abs(r0 - r1)) {
            /* no solution. one circle is contained in the other */
            return false;
        }

        /* 'point 2' is the point where the line through the circle
         * intersection points crosses the line between the circle
         * centers.  
         */

        /* Determine the distance from point 0 to point 2. */
        a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

        /* Determine the coordinates of point 2. */
        x2 = x0 + (dx * a/d);
        y2 = y0 + (dy * a/d);

        /* Determine the distance from point 2 to either of the
         * intersection points.
         */
        h = Math.sqrt((r0*r0) - (a*a));

        /* Now determine the offsets of the intersection points from
         * point 2.
         */
        rx = -dy * (h/d);
        ry = dx * (h/d);

        /* Determine the absolute intersection points. */
        var xi = x2 + rx;
        var xi_prime = x2 - rx;
        var yi = y2 + ry;
        var yi_prime = y2 - ry;

        return [xi, yi, xi_prime, yi_prime];
}

function sqr(a) {
    return a * a;
}

function center_of_two(a,b) {
	var center = new Object();
	center.x = ((a.x+b.x)/2.0);
        center.y = ((a.y+b.y)/2.0);
	return center;
}

function center_of_three(a, b, c) {
	var temp = sqr(b.x) + sqr(b.y);
	var ab = (sqr(a.x) + sqr(a.y) - temp) / 2.;
	var bc = (temp - sqr(c.x) - sqr(c.y)) / 2.;
	var det = (a.x-b.x) * (b.y-c.y) - (b.x-c.x) * (a.y-b.y);

	var center = new Object();
	
	if (Math.abs(det) < 1e-14)
	{
		center.x = ((a.x+b.x+c.x)/3.0);
		center.y = ((a.y+b.y+c.y)/3.0);
	}
	else
	{
		center.x = (ab * (b.y-c.y) - bc * (a.y-b.y)) / det;
		center.y = ((a.x-b.x) * bc - (b.x-c.x) * ab) / det;
	}
	return center;
}
