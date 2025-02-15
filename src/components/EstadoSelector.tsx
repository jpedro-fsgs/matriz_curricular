import React from 'react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { BanIcon, CheckCircle2Icon, UnlockIcon } from 'lucide-react'
import { useMatriz } from '@/context/MatrizContext'
import { EstadoDisciplina } from '@/types/DisciplinaType';

function EstadoSelector() {

    const { setFilterEstado } = useMatriz();

    function handleChange(key: string){
        setFilterEstado(EstadoDisciplina[key as keyof typeof EstadoDisciplina] || null);
    }

    return (
        <ToggleGroup onValueChange={handleChange} className='p-8 space-x-5' variant="outline" type="single">
          <ToggleGroupItem value="Disponível" aria-label="Toggle Disponível" className="border border-transparent data-[state=on]:border-primary">
            <UnlockIcon /><p className='hidden md:block'>Disponível</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="Bloqueada" aria-label="Toggle Bloqueada" className="border border-transparent data-[state=on]:border-primary">
            <BanIcon color="red" /> <p className='hidden md:block'>Bloqueada</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="Completada" aria-label="Toggle Completada" className="border border-transparent data-[state=on]:border-primary">
            <CheckCircle2Icon color="green" /><p className='hidden md:block'>Completada</p>
          </ToggleGroupItem>
        </ToggleGroup>
      )
}

export default EstadoSelector