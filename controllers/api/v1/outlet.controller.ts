import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import * as turf from '@turf/turf';
import path from 'path';
import { Feature, Polygon } from '@turf/turf';

export const fetchOutletIdentifier = (
  request: Request,
  response: Response,
  _next: NextFunction
) => {
  const polygonsFeatureCollection = JSON.parse(
    readFileSync(path.join(__dirname, '../../../../points.geo.json'), 'utf-8')
  ); // feature collection of points
  const polygonsCollection = turf.polygons(
    polygonsFeatureCollection['features']
      .filter((feature: Feature) => feature['geometry']['type'] == 'Polygon')
      .map(
        (feature: { geometry: { coordinates: number[] } }) =>
          feature['geometry']['coordinates']
      )
  );
  const polygonPointsCollection = turf.points(
    polygonsFeatureCollection['features']
      .filter((feature: Feature) => feature['geometry']['type'] == 'Point')
      .map(
        (feature: { geometry: { coordinates: number[] } }) =>
          feature['geometry']['coordinates']
      )
  );
  const polygonsArray = polygonsCollection.features.map((feature) =>
    turf.polygon(feature.geometry.coordinates)
  );
  const pointsArray = polygonPointsCollection.features.map((feature) =>
    turf.point(feature.geometry.coordinates)
  );

  if (!request.query.x || !request.query.y) {
    return response.json({
      success: false,
      coveredByPolygon: null,
      coveringPolygon: null,
      deliverablePointInPolygon: null,
      error: 'Input coordinates were not provided!',
    });
  }

  const inputXCoordinate = parseFloat(request.query.x.toString());
  const inputYCoordinate = parseFloat(request.query.y.toString());

  const coveringPolygons = polygonsArray.filter((polygon) =>
    turf.booleanPointInPolygon([inputXCoordinate, inputYCoordinate], polygon)
  );
  const coveredByPolygon = coveringPolygons.length !== 0;

  if (coveredByPolygon) {
    const deliverablePointsInPolygon = pointsArray.filter((point) =>
      turf.booleanPointInPolygon(point, coveringPolygons[0])
    );
    return response.json({
      coverage: {
        success: true,
        coveredByPolygon: coveredByPolygon,
        coveringPolygon: coveringPolygons[0],
        deliverablePointInPolygon:
          deliverablePointsInPolygon.length === 0
            ? null
            : deliverablePointsInPolygon[0],
        error: 'Input coordinates were not provided!',
      },
    });
  } else {
    return response.json({
      coverage: {
        success: true,
        coveredByPolygon: coveredByPolygon,
        coveringPolygon: null,
        deliverablePointInPolygon: null,
        error: null,
      },
    });
  }
};
