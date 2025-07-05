# Info main app:
---

_layout.tsx in  is meant for the layout/context/content of both the tabs:
```typescript

      // This is the home screen.
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      // This is the info screen.
      <Tabs.Screen
        name="two"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>re
```

Also in ```index.tsx``` the Home page code goes in there.

For ```two.tsx```, the Info page code goes in there.

I am having ```<Pressable>``` problems, so I will create a ```cspell.json``` file to resolve this with the following content:

```json
{
  "words": ["Pressable"]
}
```