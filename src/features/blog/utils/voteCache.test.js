import { test } from "node:test";
import assert from "node:assert/strict";

import { applyVoteToBlog, applyVoteToFeed, applyVoteToMyVotes } from "./voteCache.js";

const vote = { blogId: 2, myVote: 1, voteScore: 11 };

test("applyVoteToMyVotes ghi đè myVote của đúng blog và không đụng blog khác", () => {
  const list = [
    { blogId: 1, myVote: null },
    { blogId: 2, myVote: null },
  ];
  assert.deepEqual(applyVoteToMyVotes(list, vote), [
    { blogId: 1, myVote: null },
    { blogId: 2, myVote: 1 },
  ]);
});

test("applyVoteToMyVotes thêm phần tử khi blog chưa có trong cache, bỏ qua khi chưa có cache", () => {
  assert.deepEqual(applyVoteToMyVotes([{ blogId: 1, myVote: null }], vote), [
    { blogId: 1, myVote: null },
    { blogId: 2, myVote: 1 },
  ]);
  assert.equal(applyVoteToMyVotes(undefined, vote), undefined);
});

test("applyVoteToFeed cập nhật voteScore qua mọi trang, giữ nguyên field khác", () => {
  const data = {
    pageParams: [0, 1],
    pages: [
      { page: 0, items: [{ id: 1, voteScore: 5 }] },
      { page: 1, items: [{ id: 2, voteScore: 10, title: "x" }] },
    ],
  };
  const next = applyVoteToFeed(data, vote);
  assert.equal(next.pages[1].items[0].voteScore, 11);
  assert.equal(next.pages[1].items[0].title, "x");
  assert.equal(next.pages[0].items[0].voteScore, 5);
  assert.deepEqual(next.pageParams, [0, 1]);
  // Không sửa dữ liệu gốc
  assert.equal(data.pages[1].items[0].voteScore, 10);
  assert.equal(applyVoteToFeed(undefined, vote), undefined);
});

test("applyVoteToBlog cập nhật voteScore của bài chi tiết", () => {
  assert.deepEqual(applyVoteToBlog({ id: 2, voteScore: 10 }, vote), { id: 2, voteScore: 11 });
  assert.equal(applyVoteToBlog(undefined, vote), undefined);
});
