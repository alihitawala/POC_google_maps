var map;

function randLatLng() {
    return new google.maps.LatLng(((Math.random() * 17000 - 8500) / 100), ((Math.random() * 36000 - 18000) / 100));
}

function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(24.522318,77.951723),
        zoom: 8
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('ctrl'));
    var ma = new google.maps.Marker({
            draggable: true,
            position: new google.maps.LatLng('27.175015', '78.042155'),
            map: map,
            icon: 'https://mt.google.com/vt/icon?psize=20&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=.7&text=A',
            zIndex: 100000
        }),
        mb = new google.maps.Marker({
            draggable: true,
            position: new google.maps.LatLng('12.971599', '77.594563'),
            map: map,
            icon: 'https://mt.google.com/vt/icon?psize=20&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=.7&text=B',
            zIndex: 100000
        }),
        mz = new google.maps.Marker({
            draggable: true,
            position: new google.maps.LatLng('24.580000', '73.680000'),
            map: map,
            icon: 'https://mt.google.com/vt/icon?psize=20&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=.7&text=Z',
            zIndex: 100000
        }),
        mx = new google.maps.Marker({
            map: map,
            icon: 'https://mt.google.com/vt/icon?psize=20&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1&text=X',
            zIndex: 2,
            optimized: false
        }),
        ab = new google.maps.MVCArray([ma.getPosition(), mb.getPosition()])
    p1 = new google.maps.Polyline({
        map: map,
        geodesic: true,
        path: ab
    }),
        p2 = new google.maps.Polyline({
            map: map,
            geodesic: true,
            strokeColor: '#ff0000'
        });

    f = function () {
        var closest = fx(ma.getPosition(), mb.getPosition(), mz.getPosition());
        p2.setPath([mz.getPosition(), closest.p]);
        mx.setValues({
            position: closest.p
        });
        var html = '';
        html += '<li><code>A-Z: ' + Math.round(google.maps.geometry.spherical.computeDistanceBetween(ma.getPosition(), mz.getPosition())) + ' meters</code></li>';
        html += '<li><code>B-Z: ' + Math.round(google.maps.geometry.spherical.computeDistanceBetween(mb.getPosition(), mz.getPosition())) + ' meters</code></li>';
        html += '<li><code>X-Z: ' + Math.round(closest.d) + ' meters</code></li>';
        html += '<li><code>X: new google.maps.latLng(' + closest.p.toUrlValue() + ')</code></li>';
        document.getElementById('ctrl').getElementsByTagName('ul')[0].innerHTML = html;
    };

    google.maps.event.addListener(ma, 'position_changed', function () {
        p1.getPath().setAt(0, this.getPosition());
        f();
    });
    google.maps.event.addListener(mb, 'position_changed', function () {
        p1.getPath().setAt(1, this.getPosition());
        f();
    });

    google.maps.event.addListener(mz, 'position_changed', f);
    f();

}

function fx(a, b, z, s) {
    s = s || 20;


    arr = [{
        p: a
    }, {
        p: b
    }]

    for (var i = 0; i < s; ++i) {
        arr[0].d = google.maps.geometry.spherical.computeDistanceBetween(arr[0].p, z);
        arr[1].d = google.maps.geometry.spherical.computeDistanceBetween(arr[1].p, z);
        arr.push({
            p: google.maps.geometry.spherical.interpolate(arr[0].p, arr[1].p, .5)
        })
        arr[2].d = google.maps.geometry.spherical.computeDistanceBetween(arr[2].p, z);

        arr.sort(function (a, b) {
            return a.d - b.d
        });
        arr.pop();
    }

    return arr[0];
}
google.maps.event.addDomListener(window, 'load', initialize);