import React from 'react';
import { render, screen } from '@testing-library/react';
import renderFavouriteEvents from "../../../../../../pkg/atoms/pages/Event/utilities/renderFavouriteEvent";
import FavouriteEvent from "../../../../../../pkg/atoms/pages/Event/components/FavouriteEvent";

jest.mock('../../../../../../pkg/atoms/pages/Event/components/FavouriteEvent', () => {
    return jest.fn(() => <div data-testid="favourite-event"></div>);
});

describe('renderFavouriteEvents', () => {
    const mockFavouriteEvents = [
        {
            username: 'Alice Smith',
            created_at: '2024-12-27T10:00:00Z',
            description: 'A great event to attend.',
            image_path: 'https://via.placeholder.com/150',
            title: 'Music Fest 2024',
            date_of_event: '2024-12-30',
            place_of_event: 'Madison Square Garden',
        },
        {
            username: 'Bob Johnson',
            created_at: '2024-12-26T14:30:00Z',
            description: 'A must-see performance.',
            image_path: 'https://via.placeholder.com/150',
            title: 'Broadway Night',
            date_of_event: '2024-12-31',
            place_of_event: 'Broadway Theater',
        },
    ];


    test('passes the correct props to FavouriteEvent components', () => {
        render(renderFavouriteEvents(mockFavouriteEvents));

        mockFavouriteEvents.forEach((eventData, index) => {
            expect(FavouriteEvent).toHaveBeenNthCalledWith(index + 1, {
                user: {
                    name: eventData.username,
                    avatar: expect.any(Object),
                    time: new Date(eventData.created_at).toLocaleString(),
                },
                content: eventData.description,
                image: eventData.image_path,
                title: eventData.title,
                date: eventData.date_of_event,
                place: eventData.place_of_event,
            }, expect.anything());
        });
    });
});
