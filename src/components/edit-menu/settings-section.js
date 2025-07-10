import { useEffect, useCallback } from 'preact/hooks';
import { useProjectContext, setMeta, Text, MenuSection, MenuItem } from '@blockcode/core';

export function SettingsSection({ itemClassName }) {
  const { meta } = useProjectContext();

  useEffect(() => {
    if (!meta.value.classicEvents) {
      setMeta('classicEvents', false);
    }
  }, []);

  const handleToggleClassicEvents = useCallback(() => {
    const classicEvents = !meta.value.classicEvents;
    setMeta({ classicEvents });
  }, []);

  return (
    <MenuSection>
      <MenuItem
        className={itemClassName}
        onClick={handleToggleClassicEvents}
      >
        {meta.value.classicEvents ? (
          <Text
            id="arduino.menubar.edit.classicEventsClose"
            defaultMessage="Turn off Old-style Event Blocks"
          />
        ) : (
          <Text
            id="esp32.menubar.edit.classicEventsOpen"
            defaultMessage="Turn on Old-style Event Blocks"
          />
        )}
      </MenuItem>
    </MenuSection>
  );
}
