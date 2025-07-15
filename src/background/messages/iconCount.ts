import { type PlasmoMessaging } from '@plasmohq/messaging';

import drawIconWithCount from '~lib/drawIcon';

const handler: PlasmoMessaging.MessageHandler = async (req) => {
  const { count } = req.body;
  await drawIconWithCount(count);
};

export default handler;
