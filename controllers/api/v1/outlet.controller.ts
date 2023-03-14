import { NextFunction, Request, Response } from 'express'

export const fetchOutletIdentifier = (request: Request, response: Response, next: NextFunction) => {
    response.json({ message: 'POST new tea' })
}
