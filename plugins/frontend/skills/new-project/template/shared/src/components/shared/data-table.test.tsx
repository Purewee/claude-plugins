// #file tables
import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/utils'
import { DataTable, type DataTableColumn } from './data-table'

type Person = { name: string; age: number }

function makePeople(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `Хүн ${String(index + 1).padStart(2, '0')}`,
    age: 20 + index,
  }))
}

const COLUMNS: DataTableColumn<Person>[] = [
  { accessorKey: 'name', header: 'Нэр' },
  { accessorKey: 'age', header: 'Нас' },
]

function bodyRows() {
  const [, body] = screen.getAllByRole('rowgroup')
  return within(body).getAllByRole('row')
}

function button(name: string) {
  return screen.getByRole('button', { name }) as HTMLButtonElement
}

describe('DataTable', () => {
  it('shows one page of rows and pages through the rest', () => {
    renderWithProviders(<DataTable columns={COLUMNS} data={makePeople(12)} pageSize={5} />)

    expect(bodyRows()).toHaveLength(5)
    expect(screen.getByText('1 / 3')).toBeTruthy()
    expect(button({{tq:table.previous}}).disabled).toBe(true)

    fireEvent.click(button({{tq:table.next}}))

    expect(screen.getByText('2 / 3')).toBeTruthy()
    expect(bodyRows()[0].textContent).toContain('Хүн 06')

    fireEvent.click(button({{tq:table.previous}}))

    expect(screen.getByText('1 / 3')).toBeTruthy()
  })

  it('sorts a text column ascending, then descending', () => {
    renderWithProviders(<DataTable columns={COLUMNS} data={makePeople(3)} />)
    const nameHeader = screen.getByRole('columnheader', { name: 'Нэр' })

    fireEvent.click(within(nameHeader).getByRole('button'))

    expect(nameHeader.getAttribute('aria-sort')).toBe('ascending')
    expect(bodyRows()[0].textContent).toContain('Хүн 01')

    fireEvent.click(within(nameHeader).getByRole('button'))

    expect(nameHeader.getAttribute('aria-sort')).toBe('descending')
    expect(bodyRows()[0].textContent).toContain('Хүн 03')
  })

  it('hides and shows a column', () => {
    renderWithProviders(<DataTable columns={COLUMNS} data={makePeople(1)} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Нас' }))

    expect(screen.queryByRole('columnheader', { name: 'Нас' })).toBeNull()

    fireEvent.click(screen.getByRole('checkbox', { name: 'Нас' }))

    expect(screen.getByRole('columnheader', { name: 'Нас' })).toBeTruthy()
  })

  it('names a column toggle by its id when the header is not text', () => {
    renderWithProviders(
      <DataTable
        columns={[{ accessorKey: 'name', header: () => <span>Нэр</span> }]}
        data={makePeople(1)}
      />,
    )

    expect(screen.getByRole('checkbox', { name: 'name' })).toBeTruthy()
  })

  it('says so when there are no rows', () => {
    renderWithProviders(<DataTable columns={COLUMNS} data={[]} />)

    expect(screen.getByText({{tq:table.empty}})).toBeTruthy()
    expect(screen.getByText('1 / 1')).toBeTruthy()
  })

  it('renders a header without sorting or hiding as plain text', () => {
    renderWithProviders(
      <DataTable
        columns={[
          {
            accessorKey: 'name',
            header: 'Нэр',
            enableSorting: false,
            enableHiding: false,
          },
        ]}
        data={makePeople(1)}
      />,
    )

    const header = screen.getByRole('columnheader', { name: 'Нэр' })
    expect(within(header).queryByRole('button')).toBeNull()
    expect(screen.queryByRole('group')).toBeNull()
  })

  it('asks the caller for another page when the server pages the rows', () => {
    const onPageChange = vi.fn()
    renderWithProviders(
      <DataTable
        columns={COLUMNS}
        data={makePeople(5)}
        pageSize={5}
        serverPagination={{ pageIndex: 1, rowCount: 15, onPageChange }}
      />,
    )

    expect(screen.getByText('2 / 3')).toBeTruthy()
    expect(bodyRows()).toHaveLength(5)

    fireEvent.click(button({{tq:table.next}}))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
