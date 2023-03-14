import { V1 } from '../constants/routes/api-versions.constant'

export const buildRoute = (route: string, apiVersion: string) => {
    switch (apiVersion) {
        case V1:
            return `/api/${V1}${route}`
        default:
            return '/'
    }
}
