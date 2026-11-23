import React from 'react';
import { render, screen } from '@testing-library/react';
import CombatTab from '../CombatTab';
import useChatStore from '../../../store/chatStore';

const SEARING_CONE_NOTICE =
  'Ilse uses Searing Cone — manual: resolved at the table; nothing applied by the VTT (area shape (circle required; bounded damage line also supported): unsupported or conflicting mechanics; keep this ability manual.)';

describe('CombatTab', () => {
  beforeAll(() => {
    Element.prototype.scrollTo = jest.fn();
  });

  beforeEach(() => {
    useChatStore.setState({
      notifications: { social: [], combat: [], loot: [] },
      unreadCounts: { social: 0, combat: 0, loot: 0 }
    });
  });

  it('renders empty state placeholder when there are no combat notifications', () => {
    render(<CombatTab />);

    expect(
      screen.getByText('No combat events yet - events will appear here during combat')
    ).toBeInTheDocument();
  });

  it('renders a delivered Searing Cone manual combat notice with sender, timestamp, and exact wording', () => {
    const timestamp = '2026-11-22T12:00:00.000Z';
    const expectedTime = new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    useChatStore.setState({
      notifications: {
        social: [],
        combat: [
          {
            id: 'manual-searing-cone-1',
            type: 'combat',
            sender: 'Ilse',
            timestamp,
            content: SEARING_CONE_NOTICE,
            fromNetwork: true
          }
        ],
        loot: []
      },
      unreadCounts: { social: 0, combat: 1, loot: 0 }
    });

    const { container } = render(<CombatTab />);

    expect(
      screen.queryByText('No combat events yet - events will appear here during combat')
    ).not.toBeInTheDocument();

    const rows = container.querySelectorAll('.chat-message.combat-message');
    expect(rows).toHaveLength(1);
    expect(screen.getByText('Ilse')).toBeInTheDocument();
    expect(screen.getByText(SEARING_CONE_NOTICE)).toBeInTheDocument();
    expect(rows[0].querySelector('.timestamp').textContent).toBe(expectedTime);
  });

  it('handles combat notice edge cases for sender, content, and timestamps safely', () => {
    useChatStore.setState({
      notifications: {
        social: [],
        combat: [
          {
            id: 'combat-missing-sender',
            type: 'combat',
            timestamp: 'not-a-valid-date',
            content: 'Goblin takes manual burn damage'
          },
          {
            id: 'combat-whitespace-sender',
            type: 'combat',
            sender: '   ',
            content: 'Manual guard resolved'
          },
          {
            id: 'combat-object-sender',
            type: 'combat',
            sender: { name: 'Ilse' },
            timestamp: null,
            message: 'Fallback message property rendered'
          },
          {
            id: 'combat-empty-content',
            type: 'combat',
            sender: 'Ilse',
            content: ''
          }
        ],
        loot: []
      }
    });

    const { container } = render(<CombatTab />);

    const rows = container.querySelectorAll('.chat-message.combat-message');
    expect(rows).toHaveLength(3);

    expect(rows[0].querySelector('.sender-name').textContent).toBe('Combat');
    expect(rows[0].querySelector('.timestamp').textContent).toBe('');
    expect(rows[0].querySelector('.message-content').textContent).toBe(
      'Goblin takes manual burn damage'
    );

    expect(rows[1].querySelector('.sender-name').textContent).toBe('Combat');
    expect(rows[1].querySelector('.timestamp').textContent).toBe('');
    expect(rows[1].querySelector('.message-content').textContent).toBe('Manual guard resolved');

    expect(rows[2].querySelector('.sender-name').textContent).toBe('Ilse');
    expect(rows[2].querySelector('.timestamp').textContent).toBe('');
    expect(rows[2].querySelector('.message-content').textContent).toBe(
      'Fallback message property rendered'
    );

    expect(container.textContent).not.toContain('Invalid Date');
  });

  it('continues rendering all existing combat notification types alongside a manual combat notice', () => {
    const timestamp = '2026-11-22T12:05:00.000Z';

    useChatStore.setState({
      notifications: {
        social: [],
        combat: [
          {
            id: 'n-manual',
            type: 'combat',
            sender: 'Ilse',
            timestamp,
            content: SEARING_CONE_NOTICE
          },
          {
            id: 'n-dice',
            type: 'dice_roll',
            sender: 'Ilse',
            timestamp,
            diceResults: [
              { type: 'd6', value: 4 },
              { type: 'd6', value: 6 }
            ],
            total: 10
          },
          {
            id: 'n-card',
            type: 'card_draw',
            sender: 'Ilse',
            timestamp,
            drawCount: 2,
            cards: 'Ace of Spades, Queen of Hearts'
          },
          {
            id: 'n-coin',
            type: 'coin_flip',
            sender: 'Ilse',
            timestamp,
            flipCount: 2,
            results: 'Heads, Tails',
            headsCount: 1,
            tailsCount: 1
          },
          {
            id: 'n-aoe',
            type: 'spell_aoe',
            sender: 'GM',
            timestamp,
            label: 'Fireball',
            affectedCount: 1,
            affectedNames: 'Goblin Alpha'
          },
          {
            id: 'n-hit-default',
            type: 'combat_hit',
            attacker: 'Ilse',
            target: 'Goblin Alpha',
            damage: 10,
            timestamp
          },
          {
            id: 'n-hit-custom',
            type: 'combat_hit',
            attacker: 'Ilse',
            customMessage: 'Custom hit text',
            timestamp
          },
          {
            id: 'n-heal-default',
            type: 'combat_heal',
            healer: 'Cleric',
            target: 'Ilse',
            healing: 5,
            timestamp
          },
          {
            id: 'n-heal-custom',
            type: 'combat_heal',
            healer: 'Cleric',
            customMessage: 'Custom heal text',
            timestamp
          },
          {
            id: 'n-miss',
            type: 'combat_miss',
            attacker: 'Goblin Alpha',
            target: 'Ilse',
            timestamp
          },
          {
            id: 'n-crit',
            type: 'combat_crit',
            attacker: 'Ilse',
            target: 'Goblin Alpha',
            damage: 20,
            timestamp
          },
          {
            id: 'n-death',
            type: 'combat_death',
            target: 'Goblin Alpha',
            timestamp
          },
          {
            id: 'n-resource',
            type: 'combat_resource',
            attacker: 'GM',
            message: 'Ilse expended 5 mana and 1 AP',
            timestamp
          }
        ],
        loot: []
      }
    });

    const { container } = render(<CombatTab />);

    const rows = container.querySelectorAll('.chat-message');
    expect(rows).toHaveLength(13);

    expect(screen.getByText(SEARING_CONE_NOTICE)).toBeInTheDocument();
    expect(screen.getByText('2d6 (4) (6) = 10')).toBeInTheDocument();
    expect(screen.getByText(/Drew 2 cards: Ace of Spades, Queen of Hearts/)).toBeInTheDocument();
    expect(
      screen.getByText(/Flipped 2 coins: Heads, Tails \(1 Heads, 1 Tails\)/)
    ).toBeInTheDocument();
    expect(rows[4].textContent).toContain('Placed Fireball template');
    expect(rows[4].textContent).toContain('1 target: Goblin Alpha');
    expect(rows[5].textContent).toContain('Hit Goblin Alpha for 10 damage');
    expect(screen.getByText('Custom hit text')).toBeInTheDocument();
    expect(rows[7].textContent).toContain('Healed Ilse for 5 health');
    expect(screen.getByText('Custom heal text')).toBeInTheDocument();
    expect(rows[9].textContent).toContain('Missed Ilse');
    expect(rows[10].textContent).toContain('CRITICAL HIT on Goblin Alpha for 20 damage!');
    expect(screen.getByText('Has been slain')).toBeInTheDocument();
    expect(screen.getByText('Ilse expended 5 mana and 1 AP')).toBeInTheDocument();
  });
});
