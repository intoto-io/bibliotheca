import { FunctionComponent, useMemo, useState } from 'react';
import { Graph, GraphSeries } from '@intoto-dev/bibliotheca-graph';
import { Profile } from '@intoto-dev/bibliotheca-profile';

import Player from '../Player/Player';

import mock from './mocks/singleLine.json';
import profile from './mocks/amotbrua_profile.json';

const HistoricPlayer: FunctionComponent = function HistoricPlayer() {
  const [waterLevel, setWaterLevel] = useState<number | null>(null);
  const [now, setNow] = useState<string>('2021-04-21T16:00:00.000Z');

  const series: GraphSeries[] = [
    {
      key: 'singleLine',
      name: 'Water Level',
      color: '#0000ff',
      data: mock,
    },
  ];

  const currentItem = mock.find((d) => d.date === now);
  const currentWaterLevel = useMemo(() => {
    if (waterLevel === null) {
      return currentItem ? currentItem.value : 0;
    }

    return waterLevel;
  }, [currentItem, waterLevel]);

  const dates = mock.map((d) => d.date);

  return (
    <div style={{ width: 750 }}>
      <Profile profile={profile} currentWaterLevel={currentWaterLevel} width={750} />
      <Graph series={series} t={(t: string) => t} tooltip onTooltipValueChange={setWaterLevel} />
      <Player dates={dates} currentDate={now} onUpdateDate={setNow} />
    </div>
  );
};

export default HistoricPlayer;
