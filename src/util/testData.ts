/**
 * Test agenda data for unit testing or demos.
 *
 * @license MIT
 */


import { IAgendaJSON } from "../models/AgendaModel";


/**
 * returns sample data for an Agenda. Do not change this. The tests might break.
 */
export const getTestData = (): IAgendaJSON => {
    return {
        "id": "01372b5a-9394-407c-969b-00543296b9b0",
        "days": [
            {
                "id": "57ead83a-98b8-4a97-a858-c62a0a160cad",
                "startTime": "2019-12-19T07:00:25.000Z",
                "endTime": "2019-12-19T18:00:25.000Z",
                "tracks": [
                    {
                        "id": "3dbab072-e066-4ede-a15f-703500da6f79",
                        "name": "",
                        "items": [
                            {
                                "id": "85134bd7-e177-4a66-9ac7-661848d9cdf6",
                                "title": "Welcome",
                                "speaker": "Host Company",
                                "start": "2019-12-19T07:00:25.000Z",
                                "end": "2019-12-19T08:00:25.000Z"
                            },
                            {
                                "id": "6fc6df4c-ffd9-498b-bd04-eb563324707e",
                                "title": "Frontend Talk",
                                "speaker": "Dr. Felipe Gonzales",
                                "start": "2019-12-19T08:00:25.000Z",
                                "end": "2019-12-19T09:00:25.000Z"
                            },
                            {
                                "id": "b414b1e6-7824-4df1-9fc0-1813dd8937f3",
                                "title": "Backend Talk",
                                "speaker": "Ala Gökyildiz",
                                "start": "2019-12-19T09:00:25.000Z",
                                "end": "2019-12-19T11:00:25.000Z"
                            }
                        ]
                    }
                ],
                "uiHidden": false
            },
            {
                "id": "64fd8cf1-c375-4723-b59d-330e2cb219da",
                "startTime": "2019-12-20T07:00:25.000Z",
                "endTime": "2019-12-20T18:00:25.000Z",
                "tracks": [
                    {
                        "id": "616e0e96-dfde-497e-b5ef-d2fd69b7b387",
                        "name": "",
                        "items": [
                            {
                                "id": "75961b1b-f962-4178-9973-e8d45fee4582",
                                "title": "Welcome Back",
                                "speaker": "Host Company",
                                "start": "2019-12-20T07:00:25.000Z",
                                "end": "2019-12-20T08:00:25.000Z"
                            },
                            {
                                "id": "9b62a224-3fa9-4e00-9a61-426d540a6939",
                                "title": "DevOps Talk",
                                "speaker": "Dr. Ngo Nguyen",
                                "start": "2019-12-20T08:00:25.000Z",
                                "end": "2019-12-20T09:30:25.000Z"
                            },
                            {
                                "id": "5e09dd35-e1e8-4b91-ae31-cb8f3f2d3e28",
                                "title": "Lunch Break",
                                "start": "2019-12-20T11:00:25.000Z",
                                "end": "2019-12-20T12:00:25.000Z"
                            }
                        ]
                    }
                ],
                "uiHidden": false
            },
            {
                "id": "bd36abfd-648f-4374-98dd-91d6efdd5f6d",
                "startTime": "2019-12-21T07:00:25.000Z",
                "endTime": "2019-12-21T18:00:25.000Z",
                "tracks": [
                    {
                        "id": "ec07ec83-3bbb-4bd5-a939-7e2e8df1ee43",
                        "name": "",
                        "items": [
                            {
                                "id": "77bc43ae-804a-4b27-82a5-394c8cb1f4b7",
                                "title": "Workshop Presentations",
                                "speaker": "Workshop Teams",
                                "start": "2019-12-21T07:00:25.000Z",
                                "end": "2019-12-21T08:00:25.000Z"
                            },
                            {
                                "id": "626c53fb-13bd-4030-b4b9-4fe5eb8bef7f",
                                "title": "Award Ceremony",
                                "speaker": "Committee",
                                "start": "2019-12-21T08:00:25.000Z",
                                "end": "2019-12-21T09:00:25.000Z"
                            },
                            {
                                "id": "bffa1ed0-fd99-42cb-8ea9-aa92ce371c34",
                                "title": "Coffee Break",
                                "start": "2019-12-21T09:00:25.000Z",
                                "end": "2019-12-21T09:15:25.000Z"
                            },
                            {
                                "id": "e087c669-fc2b-4249-a072-c8d648d9939b",
                                "title": "Closing Remarks",
                                "speaker": "Head of Commitee",
                                "start": "2019-12-21T09:15:25.000Z",
                                "end": "2019-12-21T11:00:25.000Z"
                            }
                        ]
                    }
                ],
                "uiHidden": false
            }
        ]
    }
}


