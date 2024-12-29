import React from 'react';
import { render, screen } from '@testing-library/react';
import renderEventPost from "../../../../../../pkg/atoms/pages/Event/utilities/renderEventPost";
import EventPost from "../../../../../../pkg/atoms/pages/Event/components/EventPost";


jest.mock('../../../../../../pkg/atoms/pages/Event/components/EventPost', () => {
    return jest.fn(() => <div data-testid="event-post">Mock EventPost</div>);
});

describe('renderEventPost', () => {
    const mockEventPosts = [
        {
            username: 'John Doe',
            created_at: '2024-12-27T10:00:00Z',
            description: 'Test description 1',
            image_path: 'https://via.placeholder.com/150',
            event_id: 1,
        },
        {
            username: 'Jane Doe',
            created_at: '2024-12-26T14:30:00Z',
            description: 'Test description 2',
            image_path: 'https://via.placeholder.com/150',
            event_id: 2,
        },
    ];

   

    test('passes the correct props to EventPost components', () => {
        render(renderEventPost(mockEventPosts));

        mockEventPosts.forEach((eventPost, index) => {
            expect(EventPost).toHaveBeenNthCalledWith(index + 1, {
                user: {
                    name: eventPost.username,
                    avatar: expect.any(Object),
                    time: new Date(eventPost.created_at).toLocaleString(),
                },
                content: eventPost.description,
                image: eventPost.image_path,
                event_id: eventPost.event_id,
            }, expect.anything());
        });
    });
});
