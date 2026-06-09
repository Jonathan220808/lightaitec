(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.RelationshipSession = factory().createRelationshipSession();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const PROFILE_KEY = 'relationship.playerProfile.v1';
  const ROOM_KEY_PREFIX = 'relationship.lastRoom.';
  const DEFAULT_ROOM_TTL_MS = 24 * 60 * 60 * 1000;

  function fallbackStorage() {
    const data = {};
    return {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
      },
      setItem(key, value) {
        data[key] = String(value);
      },
      removeItem(key) {
        delete data[key];
      },
    };
  }

  function safeStorage(provided) {
    if (provided) return provided;
    try {
      const storage = window.localStorage;
      const probe = '__relationship_probe__';
      storage.setItem(probe, '1');
      storage.removeItem(probe);
      return storage;
    } catch (error) {
      return fallbackStorage();
    }
  }

  function readJson(storage, key) {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeJson(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  function defaultRandomId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID().replace(/-/g, '');
    }
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  }

  function normalizeRoomCode(value) {
    const code = String(value || '').trim();
    return /^\d{4}$/.test(code) ? code : null;
  }

  function createRelationshipSession(options = {}) {
    const storage = safeStorage(options.storage);
    const now = options.now || (() => Date.now());
    const randomId = options.randomId || defaultRandomId;

    function getProfile() {
      return readJson(storage, PROFILE_KEY);
    }

    function ensureProfile(nickname) {
      const existing = getProfile();
      const cleanName = String(nickname || existing?.nickname || '').trim();
      const time = now();
      const profile = {
        playerToken: existing?.playerToken || `guest_${randomId()}`,
        nickname: cleanName,
        avatarId: existing?.avatarId || '',
        color: existing?.color || '',
        createdAt: existing?.createdAt || time,
        lastSeenAt: time,
      };
      writeJson(storage, PROFILE_KEY, profile);
      return profile;
    }

    function saveNickname(nickname) {
      return ensureProfile(nickname);
    }

    function getNickname() {
      return getProfile()?.nickname || '';
    }

    function identityPayload(nickname) {
      const profile = ensureProfile(nickname);
      return {
        playerName: profile.nickname,
        playerToken: profile.playerToken,
      };
    }

    function roomKey(gameKey) {
      return `${ROOM_KEY_PREFIX}${gameKey}`;
    }

    function saveRoom(room) {
      if (!room?.gameKey) return null;
      const profile = ensureProfile(room.nickname);
      const time = now();
      const ttlMs = Number.isFinite(room.ttlMs) ? room.ttlMs : DEFAULT_ROOM_TTL_MS;
      const saved = {
        gameKey: room.gameKey,
        roomCode: normalizeRoomCode(room.roomCode),
        playerId: room.playerId || null,
        playerToken: profile.playerToken,
        nickname: profile.nickname,
        role: room.role || 'player',
        state: room.state || 'lobby',
        updatedAt: time,
        expiresAt: time + ttlMs,
      };
      if (!saved.roomCode) return null;
      writeJson(storage, roomKey(room.gameKey), saved);
      return saved;
    }

    function getRoom(gameKey) {
      const saved = readJson(storage, roomKey(gameKey));
      if (!saved) return null;
      if (saved.expiresAt && saved.expiresAt < now()) {
        storage.removeItem(roomKey(gameKey));
        return null;
      }
      return saved;
    }

    function clearRoom(gameKey) {
      storage.removeItem(roomKey(gameKey));
    }

    function getRoomCodeFromUrl(url) {
      try {
        const parsed = new URL(url || window.location.href, 'https://relationship.local');
        return normalizeRoomCode(parsed.searchParams.get('room') || parsed.searchParams.get('roomCode'));
      } catch (error) {
        return null;
      }
    }

    function applyNicknameToInput(inputId) {
      const input = typeof document !== 'undefined' ? document.getElementById(inputId) : null;
      const nickname = getNickname();
      if (input && nickname && !input.value) input.value = nickname;
      return nickname;
    }

    function showConnectionStatus(status, text) {
      if (typeof document === 'undefined') return;
      let el = document.getElementById('relationshipConnectionStatus');
      if (!el) {
        el = document.createElement('div');
        el.id = 'relationshipConnectionStatus';
        el.style.cssText = [
          'position:fixed',
          'left:50%',
          'top:12px',
          'z-index:99999',
          'transform:translateX(-50%)',
          'max-width:calc(100vw - 32px)',
          'padding:9px 14px',
          'border-radius:999px',
          'background:rgba(26,17,8,.9)',
          'color:#fff',
          'font-size:13px',
          'line-height:1.35',
          'box-shadow:0 8px 24px rgba(0,0,0,.16)',
          'display:none',
        ].join(';');
        document.body.appendChild(el);
      }
      el.dataset.status = status || '';
      el.textContent = text || '';
      el.style.display = text ? 'block' : 'none';
      if (status === 'restored') {
        window.setTimeout(() => {
          if (el.dataset.status === 'restored') el.style.display = 'none';
        }, 1600);
      }
    }

    function isRetryableRestoreError(message) {
      const text = String(message || '');
      return text.includes('昵称已被使用') || text.toLowerCase().includes('nickname');
    }

    return {
      DEFAULT_ROOM_TTL_MS,
      PROFILE_KEY,
      getProfile,
      ensureProfile,
      saveNickname,
      getNickname,
      identityPayload,
      saveRoom,
      getRoom,
      clearRoom,
      getRoomCodeFromUrl,
      applyNicknameToInput,
      showConnectionStatus,
      isRetryableRestoreError,
    };
  }

  return { createRelationshipSession };
});
