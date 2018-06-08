var viewer = new Cesium.Viewer('cesiumContainer');
camera = viewer.camera;
const init_longitude = -73.985130;
const init_latitude = 40.758896;
const init_height = 10000;
camera.setView({
    destination : Cesium.Cartesian3.fromDegrees(init_longitude, init_latitude, init_height),
    orientation: {
        heading : 0.0,
        pitch : -Cesium.Math.PI_OVER_TWO,
        roll : 0.0
    }
});
// Code for tilesetx
const x = 1333822.6995361117;
const y = -4653081.0937212715;
const z = 4139734.461117156;
camera.setView({
    destination : new Cesium.Cartesian3(x, y, z),
    orientation: {
        heading : 0,
        pitch : 0,
        roll : 0
    }
});

// Visualize the tiles and their bounding boxes/viewer volumes
var tileset = [];
var visibleTiles = [];
var musificationStart = false;
var datums = [];

for(var i = 0; i < buildings.length; i++){
    var p = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url : '../'+buildings[i],
        debugColorizeTiles: false,
        debugShowViewerRequestVolume: false,
        debugShowBoundingVolume: false
    }));
    tileset.push(p);
    tileset[i].tileVisible.addEventListener(function(tile) {
        if (!visibleTiles.includes(tile) & musificationStart){
            datums.push({'json':tile._content._batchTable.batchTableJson,'center':tile._boundingVolume._orientedBoundingBox.center,'content':tile._content});
            visibleTiles.push(tile)
        }
		});
}

// Visible tiles become data for musicifation
function visibilityCheck() {
    if (!musificationStart) {
        console.log("Initializing visible tile musification");
        visibleTiles = [];
        datums = [];
        musificationStart = true;
        setTimeout(musify, 100);
    }
    else {
        console.log("Disabling visible tile musification");
        visibleTiles = [];
        datums = [];
        musificationStart = false;
    }
}

function compareTiles(a,b){
    const center_A = a['center'];
    const center_B = b['center'];
    const camera_dist_A = Cesium.Cartesian3.distance(viewer.scene.camera.position, center_A);
    const camera_dist_B = Cesium.Cartesian3.distance(viewer.scene.camera.position, center_B);
    return camera_dist_A-camera_dist_B;
}

const MUSIFICATION_BUILDING_NUMBER = 3;
var MUSIFICATION_DELAY = 0;

function colorizeChaoticOnce(musified_datums){

    for (let i = 0; i < musified_datums.length; i += 1) {
        let content = musified_datums[i]['content'];
        let featuresLength = content.featuresLength;
        for (let j = 0; j < featuresLength; j += 1) {
            content.getFeature(j).color = Cesium.Color.fromRandom();}
    }

}
async function musifyDatumRange(musified_datums) {
    let MUSIC_STEPS = 1;

    for (let i = 0; i < MUSIC_STEPS; i += 1) {
        colorizeChaoticOnce(musified_datums);
    }
    for (let j =0;j<500;j+=1) {
        console.log(j)
    }
}
async function musify(){
    datums.sort(compareTiles); // do not log beforehand, as logging will show the new state of datums (during console printing)

    for (let k=0; k < datums.length/MUSIFICATION_BUILDING_NUMBER; k+=1) {
        for (let i = 0; i < datums.length; i += 1) {
            var content = datums[i]['content'];
            var featuresLength = content.featuresLength;
            for (let j = 0; j < featuresLength; j += 1) {
                content.getFeature(j).color = new Cesium.Color(0, 0, 0, 0.3);
            }
        }

        MUSIFICATION_DELAY = 5000;
        musified_datums = datums.slice(k*MUSIFICATION_BUILDING_NUMBER,(k+1)*MUSIFICATION_BUILDING_NUMBER);
        musifyDatumRange(musified_datums);
        await sleep(MUSIFICATION_DELAY);
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

