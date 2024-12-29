import React from "react";
import { render, screen } from "@testing-library/react";
import renderCommunityPost from "../../../../../../pkg/atoms/pages/Community/utilities/renderCommunityPost";
import CommunityPost from "../../../../../../pkg/atoms/pages/Community/components/CommunityPost";

jest.mock("../../../../../../pkg/atoms/pages/Community/components/CommunityPost", () => {
    return jest.fn(() => <div data-testid="community-post"></div>);
});

jest.mock("react-avatar", () => {
    return jest.fn(() => <div data-testid="avatar"></div>);
});

describe("renderCommunityPost", () => {
    const mockGroupPosts = [
        {
            username: "Alice Smith",
            created_at: "2024-12-27T10:00:00Z",
            description: "This is a test post.",
            image_path: "https://via.placeholder.com/300",
            group_id: 1,
        },
        {
            username: "Bob Johnson",
            created_at: "2024-12-26T14:30:00Z",
            description: "Another test post.",
            image_path: "https://via.placeholder.com/300",
            group_id: 2,
        },
    ];

    const displayName = "TestUser";



    test("passes the correct props to CommunityPost components", () => {
        render(<>{renderCommunityPost(mockGroupPosts, displayName)}</>);

        mockGroupPosts.forEach((groupPost, index) => {
            expect(CommunityPost).toHaveBeenNthCalledWith(index + 1, {
                user: {
                    name: groupPost.username,
                    avatar: expect.any(Object),
                    time: new Date(groupPost.created_at).toLocaleString(),
                },
                content: groupPost.description,
                image: groupPost.image_path,
                postId: groupPost.group_id,
                username: displayName,
            }, expect.anything());
        });
    });


});
