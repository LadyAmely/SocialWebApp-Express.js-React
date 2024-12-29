import React from "react";
import { render, screen } from "@testing-library/react";
import renderNewsPost from "../../../../../../pkg/atoms/pages/News/utilities/renderNewsPost";
import NewsPost from "../../../../../../pkg/atoms/pages/News/components/NewsPost";

jest.mock("../../../../../../pkg/atoms/pages/News/components/NewsPost", () => {
    return jest.fn(() => <div data-testid="news-post"></div>);
});

jest.mock("react-avatar", () => {
    return jest.fn(() => <div data-testid="avatar"></div>);
});

describe("renderNewsPost", () => {
    const mockNewsPosts = [
        {
            username: "Alice Smith",
            created_at: "2024-12-27T10:00:00Z",
            description: "Breaking news content.",
            image_path: "https://via.placeholder.com/300",
            news_id: 1,
        },
        {
            username: "Bob Johnson",
            created_at: "2024-12-26T14:30:00Z",
            description: "Latest updates from the world.",
            image_path: "https://via.placeholder.com/300",
            news_id: 2,
        },
    ];

    const displayName = "TestUser";

   

    test("passes the correct props to NewsPost components", () => {
        render(renderNewsPost(mockNewsPosts, displayName));

        mockNewsPosts.forEach((newsPost, index) => {
            expect(NewsPost).toHaveBeenNthCalledWith(index + 1, {
                user: {
                    name: newsPost.username,
                    avatar: expect.any(Object),
                    time: new Date(newsPost.created_at).toLocaleString(),
                },
                content: newsPost.description,
                image: newsPost.image_path,
                postId: newsPost.news_id,
                username: displayName,
            }, expect.anything());
        });
    });


});
