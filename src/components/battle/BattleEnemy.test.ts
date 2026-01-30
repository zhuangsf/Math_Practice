/**
 * BattleEnemy Component Tests - Battle Flow Integration Tests
 * modify by jx: test cases for hit animation during battle answer flow
 */

import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import BattleEnemy from './BattleEnemy.vue';

describe('BattleEnemy Battle Flow Animation', () => {
  let wrapper: VueWrapper<any>;

  // modify by jx: enable shake in tests that assert animation; app default is off
  const defaultProps = {
    hp: 50,
    maxHp: 100,
    attack: 10,
    isHit: false,
    isAttacking: false,
    shakeEnabled: true
  };

  beforeEach(() => {
    wrapper = mount(BattleEnemy, {
      props: defaultProps
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('First Hit After Game Start', () => {
    it('should animate when isHit changes from false to true (first hit)', async () => {
      const enemy = wrapper.find('.battle-enemy');
      
      // Simulate first hit after game starts
      await wrapper.setProps({ isHit: true });
      await nextTick();
      // modify by jx: wait for requestAnimationFrame to re-apply hit-anim class (shake replay)
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify animation class is applied
      const classes = enemy.classes();
      expect(classes.some(c => c.startsWith('hit-anim-'))).toBe(true);
      
      // Verify hitAnimationEnd is emitted after animation
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(wrapper.emitted('hitAnimationEnd')).toBeTruthy();
      expect(wrapper.emitted('hitAnimationEnd')?.length).toBe(1);
    });
  });

  describe('Second Hit After First Correct Answer', () => {
    it('should animate on second correct answer after first animation completes', async () => {
      const enemy = wrapper.find('.battle-enemy');
      
      // First correct answer
      await wrapper.setProps({ isHit: true });
      await nextTick();
      
      // Wait for first animation to complete
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(wrapper.emitted('hitAnimationEnd')?.length).toBe(1);
      
      // Reset isHit for next answer
      await wrapper.setProps({ isHit: false });
      await nextTick();
      
      // Second correct answer
      await wrapper.setProps({ isHit: true });
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify animation class is applied again
      const classes = enemy.classes();
      const hitClasses = classes.filter(c => c.startsWith('hit-anim-'));
      expect(hitClasses.length).toBeGreaterThan(0);
      
      // Wait for second animation to complete
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(wrapper.emitted('hitAnimationEnd')?.length).toBe(2);
    });

    it('should have different animation class for second hit', async () => {
      const enemy = wrapper.find('.battle-enemy');
      
      // First hit
      await wrapper.setProps({ isHit: true });
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));
      const firstClasses = enemy.classes();
      const firstHitClass = firstClasses.find(c => c.startsWith('hit-anim-'));
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Reset
      await wrapper.setProps({ isHit: false });
      await nextTick();
      
      // Second hit
      await wrapper.setProps({ isHit: true });
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));
      const secondClasses = enemy.classes();
      const secondHitClass = secondClasses.find(c => c.startsWith('hit-anim-'));
      
      // Classes should be different
      expect(firstHitClass).not.toBe(secondHitClass);
    });
  });

  describe('Multiple Successive Hits', () => {
    it('should animate correctly for 3 successive correct answers', async () => {
      const enemy = wrapper.find('.battle-enemy');
      
      // First answer
      await wrapper.setProps({ isHit: true });
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Second answer
      await wrapper.setProps({ isHit: false });
      await nextTick();
      await wrapper.setProps({ isHit: true });
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Third answer
      await wrapper.setProps({ isHit: false });
      await nextTick();
      await wrapper.setProps({ isHit: true });
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Verify all 3 animations triggered
      expect(wrapper.emitted('hitAnimationEnd')?.length).toBe(3);
    });
  });

  describe('Animation State Tracking', () => {
    it('should emit hitAnimationEnd exactly once per hit', async () => {
      // First hit
      await wrapper.setProps({ isHit: true });
      await nextTick();
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Second hit
      await wrapper.setProps({ isHit: false });
      await nextTick();
      await wrapper.setProps({ isHit: true });
      await nextTick();
      
      // Wait for second animation to complete
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Should have exactly 2 events
      expect(wrapper.emitted('hitAnimationEnd')?.length).toBe(2);
    });

    it('should not emit hitAnimationEnd when isHit is false', async () => {
      // Component starts with isHit = false
      await nextTick();
      
      // Wait a bit to ensure no false triggers
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // No events should be emitted
      expect(wrapper.emitted('hitAnimationEnd')).toBeFalsy();
    });
  });

  describe('Damage Popup Display', () => {
    it('should show damage popup for each hit', async () => {
      // First hit
      await wrapper.setProps({ isHit: true });
      await nextTick();
      expect(wrapper.find('.damage-popup').exists()).toBe(true);
      // modify by jx: popup shows actual damage with minus sign e.g. -5.2
      expect(wrapper.find('.damage-popup').text()).toMatch(/^-\d+(\.\d+)?$/);
      
      // Wait for popup to hide
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Second hit
      await wrapper.setProps({ isHit: false });
      await nextTick();
      await wrapper.setProps({ isHit: true, lastDamage: 8.5 });
      await nextTick();
      
      // Popup should show again with passed lastDamage
      expect(wrapper.find('.damage-popup').exists()).toBe(true);
      expect(wrapper.find('.damage-popup').text()).toMatch(/^-\d+(\.\d+)?$/);
    });
  });
});

describe('BattleEnemy Component Re-mount Animation', () => {
  /**
   * Test that animation works when component is re-mounted with :key
   * modify by jx: verify the key-based re-render triggers animation
   */
  it('should animate when re-mounted with new key', async () => {
    const wrapper = mount(BattleEnemy, {
      props: {
        hp: 50,
        maxHp: 100,
        attack: 10,
        isHit: false,
        isAttacking: false,
        shakeEnabled: true  // modify by jx: enable shake for animation assertion
      }
    });

    const enemy = wrapper.find('.battle-enemy');

    // modify by jx: wait for component ready (onMounted + nextTick) before first hit
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 20));

    // First mount and hit
    await wrapper.setProps({ isHit: true });
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(enemy.classes().some(c => c.startsWith('hit-anim-'))).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 350));

    // Simulate component re-mount by setting key (through v-if in parent)
    // In this test, we just verify the component can handle isHit toggling
    await wrapper.setProps({ isHit: false });
    await nextTick();

    // Second hit
    await wrapper.setProps({ isHit: true });
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(enemy.classes().some(c => c.startsWith('hit-anim-'))).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(wrapper.emitted('hitAnimationEnd')?.length).toBe(2);

    wrapper.unmount();
  });
});
