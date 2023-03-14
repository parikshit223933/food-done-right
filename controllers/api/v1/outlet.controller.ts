import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import * as turf from '@turf/turf';
import path from 'path';
import { Feature } from '@turf/turf';
import { fetchLocationDetails } from '../../../services/location.service';

export const fetchOutletIdentifier = (
  request: Request,
  response: Response,
  _next: NextFunction
) => {
  fetchLocationDetails(request.query.query as string)
    .then((locationData) => {
      const polygonsFeatureCollection = JSON.parse(
        readFileSync(
          path.join(__dirname, '../../../../points.geo.json'),
          'utf-8'
        )
      ); // feature collection of points
      const coordinatesToPolygonPropertiesHash = new Map();
      const coordinatesToPointPropertiesHash = new Map();

      const polygonsCollection = turf.polygons(
        polygonsFeatureCollection['features']
          .filter(
            (feature: Feature) => feature['geometry']['type'] == 'Polygon'
          )
          .map((feature: { geometry: { coordinates: number[] } }) => {
            coordinatesToPolygonPropertiesHash.set(
              feature['geometry']['coordinates'],
              (feature as any)['properties']
            );
            return feature['geometry']['coordinates'];
          })
      );
      const polygonPointsCollection = turf.points(
        polygonsFeatureCollection['features']
          .filter((feature: Feature) => feature['geometry']['type'] == 'Point')
          .map((feature: { geometry: { coordinates: number[] } }) => {
            coordinatesToPointPropertiesHash.set(
              feature['geometry']['coordinates'],
              (feature as any)['properties']
            );
            return feature['geometry']['coordinates'];
          })
      );
      const polygonsArray = polygonsCollection.features.map((feature) =>
        turf.polygon(
          feature.geometry.coordinates,
          coordinatesToPolygonPropertiesHash.get(feature.geometry.coordinates)
        )
      );
      const pointsArray = polygonPointsCollection.features.map((feature) =>
        turf.point(
          feature.geometry.coordinates,
          coordinatesToPointPropertiesHash.get(feature.geometry.coordinates)
        )
      );
      if (
        !locationData?.data?.data ||
        locationData?.data?.data.length === 0 ||
        !locationData?.data?.data[0].longitude ||
        !locationData?.data?.data[0].latitude
      ) {
        console.log(locationData.data.data);
        return response.json({
          success: false,
          coveredByPolygon: null,
          coveringPolygon: null,
          deliverablePointInPolygon: null,
          error: 'Could not find any such location. Please try again',
        });
      }
      const inputXCoordinate = locationData?.data?.data?.longitude;
      const inputYCoordinate = locationData?.data?.data?.latitude;

      const coveringPolygons = polygonsArray.filter((polygon) =>
        turf.booleanPointInPolygon(
          [inputXCoordinate, inputYCoordinate],
          polygon
        )
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
            error: null,
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
    })
    .catch((error) => {
      console.log(error);
      return response.json({
        success: false,
        coveredByPolygon: null,
        coveringPolygon: null,
        deliverablePointInPolygon: null,
        error: 'Unsupported Location. Please try again',
      });
    });
};
