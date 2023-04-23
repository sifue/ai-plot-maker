// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { PlotParameter, PARAMETERS } from '../../components/parameters'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  console.log(PARAMETERS);
  console.log(req.body);
  res.status(200).json(req.body)
}
