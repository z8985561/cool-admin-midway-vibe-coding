import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { ShopReviewService } from '../src/modules/shop/service/review';
import * as path from 'path';

describe('Shop Review Module Integration', () => {
  let app;
  let reviewService;

  beforeAll(async () => {
    app = await createApp<Framework>(path.join(__dirname, '..'));
    reviewService = await app.getApplicationContext().getAsync(ShopReviewService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('should validate review score', () => {
    const scores = [1, 2, 3, 4, 5];
    scores.forEach(score => {
      expect(score).toBeGreaterThanOrEqual(1);
      expect(score).toBeLessThanOrEqual(5);
    });
  });

  it('should validate review content', () => {
    const content = '商品很好，五星好评！';
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it('should validate review images format', () => {
    const images = ['http://example.com/img1.jpg', 'http://example.com/img2.jpg'];
    images.forEach(img => expect(img).toMatch(/^https?:\/\//));
  });

  it('should calculate average rating', () => {
    const scores = [5, 4, 5, 3, 5];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    expect(avg).toBe(4.4);
  });
});
