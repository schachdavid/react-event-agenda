import React from 'react';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import TimeLineView from './TimeLineView';
import moment, { Duration } from 'moment';



interface IProps {
}


const TimeLineController: React.FC<IProps> = ({ }: IProps) => {
    const viewModel = useViewModelContext();

    const intervalPxHeight = viewModel.getIntervalPxHeight();
    const intervalInMin = viewModel.getIntervalInMin();
    const segmentFactor = viewModel.getSegmentFactor();
    const endTime = viewModel.getEndTime();
    const startTime = viewModel.getStartTime();


    var duration: Duration = moment.duration(endTime.diff(startTime));
    var minutes = duration.asMinutes();

    const numberOfSegments = minutes / intervalInMin / segmentFactor;

    let timeLabels: Array<string> = [];

    let currentTime = moment(startTime);

    timeLabels.push(currentTime.format('HH:mm'));

    for (let i: number = 0; i < numberOfSegments - 1; i++) {
        currentTime.add('minutes', intervalInMin*segmentFactor);
        timeLabels.push(currentTime.format('HH:mm'));
    }


    return <TimeLineView
        timeLabels={timeLabels}
        segmentHeight={intervalPxHeight * segmentFactor - 1}
    />
}

export const TimeLine = observer(TimeLineController);
