import Twit from '../../twit/twit'
import type { NextApiRequest, NextApiResponse } from 'next'


export default (req: NextApiRequest, res: NextApiResponse) => {
    Twit.get('search/tweets', { from: 'OzanTufan3', count:  10 }, function (err:Error, data: object, response: NextApiResponse) {
        if (err) {
            res.status(400).json(err)
        }
        
        console.log(data);
        
        res.status(200).json(data)
    })
}