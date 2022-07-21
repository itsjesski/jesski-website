import { getTwitchLiveStatus } from '../../../utils/Twitch';

export default async function handler(
  _req: {},
  res: {
    json: (results: { status: boolean }) => void;
  }
) {
  const liveStatus = await getTwitchLiveStatus();

  const response = {
    status: liveStatus,
  };

  res.json(response);
}
