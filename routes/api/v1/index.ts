import express, { Router } from 'express'
import { fetchOutletIdentifier } from '../../../controllers/api/v1'
import { V1 } from '../../../constants/routes/api-versions.constant'
import { buildRoute } from '../../../utils/routes.util'

const router: Router = express.Router()

router.get(buildRoute('/outlet/fetch-identifier', V1), fetchOutletIdentifier)

export default router
