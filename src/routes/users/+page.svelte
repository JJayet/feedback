<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import AuthorizationAlert from '$lib/components/AuthorizationAlert.svelte'
  import DataTable from '$lib/components/DataTable.svelte'
  import TextareaInput from '$lib/components/inputs/TextareaInput.svelte'
  import TextInput from '$lib/components/inputs/TextInput.svelte'
  import ModalEditor from '$lib/components/ModalEditor.svelte'
  import { savable } from '$lib/savable'
  import { trpc } from '$lib/trpc/client'
  import type { RouterInputs } from '$lib/trpc/router'
  import { TRPCClientError } from '@trpc/client'
  import type { PageData } from './$types'

  export let data: PageData

  let busy = false
  let item: RouterInputs['users']['save'] | null = null // 👈 we're using a helper type
  let errors: { message: string; path: string[] }[] | null = null
  let needsAuthorization = !data.isAuthenticated

  const handleAdd = async () => {
    if (!data.isAuthenticated) {
      needsAuthorization = true
      return
    }
    item = { id: null, firstName: '', lastName: '', email: '' }
  }

  const handleEdit = async (e: CustomEvent<string>) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true
      return
    }
    busy = true
    item = await trpc().users.load.query(e.detail)
    busy = false
  }

  const handleDelete = async (e: CustomEvent<string>) => {
    //   if (!data.isAuthenticated) {
    //     needsAuthorization = true
    //     return
    //   }
    //   busy = true
    //   await trpc().users.delete.mutate(e.detail)
    //   await invalidateAll()
    //   busy = false
  }

  const handleCancel = () => {
    item = null
    errors = null
  }

  const handleSave = async (e: { detail: RouterInputs['users']['save'] }) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true
      return
    }

    busy = true
    try {
      await trpc().users.save.mutate(savable(e.detail))
      item = null
      await invalidateAll()
    } catch (err) {
      if (err instanceof TRPCClientError) {
        errors = JSON.parse(err.message)
      } else {
        throw err
      }
    } finally {
      busy = false
    }
  }
</script>

<svelte:head>
  <title>Users • Feedback</title>
</svelte:head>

<DataTable
  {busy}
  title="Authors"
  items={data.users}
  columns={[
    {
      title: 'Email',
      accessor: ({ email }) => email,
    },
    {
      title: 'Name',
      grow: true,
      accessor: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    },
    {
      title: 'Feedbacks',
      align: 'right',
      accessor: (user) => user._count.givenFeedbacks,
    },
  ]}
  on:add={handleAdd}
  on:edit={handleEdit}
  on:delete={handleDelete}
/>

<ModalEditor
  {item}
  itemName="author"
  on:cancel={handleCancel}
  on:save={handleSave}
>
  <div class="grid">
    <TextInput name="firstName" label="First name" required {errors} {item} />
    <TextInput name="lastName" label="Last name" required {errors} {item} />
    <TextInput name="email" label="Email" required {errors} {item} />
  </div>
</ModalEditor>

<AuthorizationAlert
  visible={needsAuthorization}
  on:close={() => (needsAuthorization = false)}
/>
