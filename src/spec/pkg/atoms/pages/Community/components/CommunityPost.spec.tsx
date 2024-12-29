import React from 'react';
import { render, screen } from '@testing-library/react';
import CommunityPost from "../../../../../../pkg/atoms/pages/Community/components/CommunityPost";


jest.mock('../../../../../../Components/CommentMain', () => {
    return jest.fn(() => <div data-testid="comment-main"></div>);
});

describe('CommunityPost Component', () => {
    const mockProps = {
        user: {
            name: 'John Doe',
            avatar: 'https://via.placeholder.com/150',
            time: '2 hours ago',
        },
        content: 'This is a test post.',
        image: 'https://via.placeholder.com/300',
        postId: 1,
        username: 'johndoe',
    };

    test('renders user information correctly', () => {
        render(<CommunityPost {...mockProps} />);

        expect(screen.getByText(mockProps.user.name)).toBeInTheDocument();
        expect(screen.getByText(mockProps.user.time)).toBeInTheDocument();
    });

    test('renders post content correctly', () => {
        render(<CommunityPost {...mockProps} />);

        expect(screen.getByText(mockProps.content)).toBeInTheDocument();
    });


    test('renders action buttons with correct text and icons', () => {
        render(<CommunityPost {...mockProps} />);

        const actions = ['Like', 'Comment', 'Share'];
        actions.forEach((action) => {
            expect(screen.getByText(action)).toBeInTheDocument();
        });
    });


});
